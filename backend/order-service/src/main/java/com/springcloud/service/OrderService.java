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
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    // Remove: temporary dataset and getter
    @Getter
    List<CropInfo> crops = List.of(
            new CropInfo(1L, "Corn", new BigDecimal("120"), "Sunny Farm", 101L, "Iowa, USA", 4.5, true, "corn.jpg", "kg", true, false, List.of("Organic", "On Sale")),
            new CropInfo(2L, "Wheat", new BigDecimal("120"), "Golden Fields", 101L, "Kansas, USA", 4.2, false, "wheat.jpg", "kg", true, false, List.of()),
            new CropInfo(3L, "Rice", new BigDecimal("110"), "Green Valley", 101L, "Kandy, Sri Lanka", 4.7, true, "rice.jpg", "kg", true, false, List.of("Organic")),
            new CropInfo(4L, "Tomato", new BigDecimal("95"), "Highland Farms", 104L, "Nuwara Eliya, Sri Lanka", 4.0, false, "tomato.jpg", "kg", true, false, List.of("On Sale")),
            new CropInfo(5L, "Potato", new BigDecimal("80"), "Riverbend Farm", 105L, "Badulla, Sri Lanka", 4.3, true, "potato.jpg", "kg", true, false, List.of()),
            new CropInfo(6L, "Green Gram", new BigDecimal("210"), "AgroCare Co‑op", 106L, "Kurunegala, Sri Lanka", 4.8, true, "green_gram.jpg", "kg", true, false, List.of("Organic", "Certified"))
    );


    public List<Order> create(Long userId, CreateOrderRequest request) {

        // Create a lookup map: cropId -> farmerId
        Map<Long, Long> cropToFarmer = crops.stream()
                .collect(Collectors.toMap(CropInfo::getId, CropInfo::getFarmerId));
        // TODO : Fetch crop items in the order from the crop-listing-service
        // TODO : Deduce stock by the quantity requested by the buyer for each item in the order

        // Given request.items() is List<OrderItemRequest> with getCropId()
        List<OrderItemRequest> items = request.items();

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
                    .status("PENDING")
                    .total(total)
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

    public Order cancel(Long userId, Long orderId) {

        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus("CANCELED");
                    // TODO : restore the stock of order items
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found"));
    }
}