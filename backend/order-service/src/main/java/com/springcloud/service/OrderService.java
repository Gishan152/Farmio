package com.springcloud.service;

import com.springcloud.dto.*;
import com.springcloud.exception.ResourceNotFoundException;
import com.springcloud.model.CropInfo;
import com.springcloud.model.Order;
import com.springcloud.model.OrderItem;
import com.springcloud.repository.OrderRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

import com.springcloud.common.enums.OrderStatus;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final com.springcloud.feign.PaymentServiceClient paymentServiceClient;
    private final com.springcloud.feign.CropListingServiceClient cropListingServiceClient;

    private final OrderRepository orderRepository;


    public List<Order> create(Long userId, CreateOrderRequest request) {

        // Extract the list of crop IDs from the order request
        List<OrderItemRequest> items = request.items();
        List<Long> cropIds = items.stream()
                .map(OrderItemRequest::getCropId)
                .distinct()
                .collect(Collectors.toList());

        // TODO (COMPLETED): Fetch crop items in the order from the crop-listing-service
        List<CropInfo> requestedCrops = cropListingServiceClient.getProductsByIds(cropIds);
        System.out.println("Fetched " + requestedCrops.size() + " crops from crop-listing-service: " + requestedCrops);
        
        // Create a lookup map: cropId -> CropInfo
        Map<Long, CropInfo> cropMap = requestedCrops.stream()
                .collect(Collectors.toMap(CropInfo::getId, crop -> crop));
        
        // Create a lookup map: cropId -> farmerId
        Map<Long, Long> cropToFarmer = requestedCrops.stream()
                .collect(Collectors.toMap(CropInfo::getId, CropInfo::getFarmerId));

        // TODO (COMPLETED): Deduce stock by the quantity requested by the buyer for each item in the order
        // Deduct stock for each item before creating the order
        items.forEach(item -> {
            try {
                cropListingServiceClient.deductStock(item.getCropId(), item.getQuantity().intValue());
            } catch (Exception e) {
                throw new RuntimeException("Failed to deduct stock for crop " + item.getCropId() + ": " + e.getMessage());
            }
        });

        Map<Long, List<OrderItemRequest>> itemsByFarmer = items.stream()
                .filter(item -> cropToFarmer.containsKey(item.getCropId()))
                .collect(Collectors.groupingBy(item -> cropToFarmer.get(item.getCropId())));

        // Example: iterate and process each farmer's items
        List<Order> orderList = new ArrayList<>();
        itemsByFarmer.forEach((farmerId, farmerItems) -> {
            System.out.println("Farmer " + farmerId + " has these items:");
            farmerItems.forEach(item ->
                    System.out.println("  - Crop " + item.getCropId() +
                            ", Quantity: " + item.getQuantity())
            );

            BigDecimal total = farmerItems.stream()
                    .map(item -> item.getPricePerUnit().multiply(item.getQuantity()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            var order = Order.builder()
                    .farmerId(1L)
                    .buyerId(userId)
                    .paymentId("123")
                    .status(OrderStatus.PENDING)
                    .total(total)
                    .transport("BY_BUYER")
                    .build();

//            orderRepository.saveAndFlush(order);

            farmerItems.forEach(itemReq -> {
                var oi = OrderItem.builder()
                        .cropId(itemReq.getCropId())
                        .pricePerUnit(itemReq.getPricePerUnit())
                        .unitMeasurement(itemReq.getUnitMeasurement())
                        .quantity(itemReq.getQuantity())
                        .build();
                order.addItem(oi);
            });

            var savedOrder = orderRepository.save(order);

            System.out.println("Order saved...");
            orderList.add(savedOrder);
        });

        return orderList;
    }

    public List<Order> get(Long userId, String userRole) {

        List<Order> orderList;

        if(Objects.equals(userRole, "ROLE_FARMER")){
            orderList = orderRepository.findByFarmerId(userId);
        }else{
            orderList = orderRepository.findByBuyerId(userId);
        }

        return orderList;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order markReadyToPickup(Long userId, Long orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    if(!order.getFarmerId().equals(userId)){
                        throw new RuntimeException("Unauthorized");
                    }
                    if(order.getStatus().equals(OrderStatus.PROCESSING)){
                        throw new RuntimeException("Buyer have not made the payment yet");
                    }
                    order.setStatus(OrderStatus.AWAITING_PICKUP);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found"));
    }

    public Order markPaymentCompleted(Long orderId) {
        // TODO : make security verifications
        return orderRepository.findById(orderId)
                .map(order -> {
                    if(!order.getStatus().equals(OrderStatus.PENDING)){
                        throw new RuntimeException("Payment is already completed");
                    }
                    order.setStatus(OrderStatus.PROCESSING);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found"));
    }

    public Order markInTransport(Long userId, Long orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    if(!order.getFarmerId().equals(userId)){
                        throw new RuntimeException("Unauthorized");
                    }
                    if(!order.getStatus().equals(OrderStatus.PENDING)){
                        throw new RuntimeException("Payment is already completed");
                    }
                    order.setStatus(OrderStatus.PROCESSING);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found"));
    }

    public Order markDelivered(Long userId, Long orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    if(!order.getBuyerId().equals(userId)){
                        throw new RuntimeException("Unauthorized");
                    }
                    OrderStatus status = order.getStatus();
                    if(!EnumSet.of(OrderStatus.AWAITING_PICKUP, OrderStatus.IN_TRANSPORT).contains(status)){
                        throw new IllegalStateException(
                                "Order cannot be cancelled in the current state: " + status
                        );
                    }

                    // TODO : Check the code below for releasing escrow to farmer
                    var releaseRequest = new EscrowReleaseRequest(
                        order.getId().toString()
                    );
                    try {
                        paymentServiceClient.releaseEscrow(releaseRequest);
                    } catch (Exception e) {
                        System.err.println("Failed to release escrow: " + e.getMessage());
                    }

                    order.setStatus(OrderStatus.DELIVERED);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found"));
    }

    public Order refund(Long userId, Long orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    if(!order.getBuyerId().equals(userId)){
                        throw new RuntimeException("Unauthorized");
                    }
                    OrderStatus status = order.getStatus();
                    if(!status.equals(OrderStatus.DELIVERED)){
                        throw new IllegalStateException(
                                "Order cannot be refunded in the current state: " + status + ", Cancel the order instead"
                        );
                    }

                    // TODO : Release the pending payment to the farmer
                    order.setStatus(OrderStatus.DELIVERED);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found"));
    }

    public Order cancel(Long userId, Long orderId) {

        return orderRepository.findById(orderId)
                .map(order -> {
                    OrderStatus status = order.getStatus();

                    if (!EnumSet.of(OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.AWAITING_PICKUP).contains(status)) {
                        throw new IllegalStateException(
                                "Order cannot be cancelled in the current state: " + status
                        );
                    }

                    BigDecimal refundRatio = switch (status) {
                        case PROCESSING -> BigDecimal.valueOf(0.8);
                        case AWAITING_PICKUP -> BigDecimal.valueOf(0.7);
                        default -> BigDecimal.ZERO;
                    };

                    BigDecimal refundAmount = order.getTotal()
                            .multiply(refundRatio)
                            .setScale(2, RoundingMode.HALF_UP);
//                    order.setRefundAmount(refundAmount);

                    // Feign call to refund escrow
                    var refundRequest = new EscrowRefundRequest(
                        order.getId().toString()
                    );
                    try {
                        paymentServiceClient.refundEscrow(refundRequest);
                    } catch (Exception e) {
                        System.err.println("Failed to refund escrow: " + e.getMessage());
                    }

                    order.setStatus(OrderStatus.CANCELLED);
                    // TODO : restore the stock of order items
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found"));
    }
    
    /**
     * Fetch all available crops from crop-listing-service
     */
    public List<CropInfo> getCrops() {
        return cropListingServiceClient.getAllProducts();
    }

}