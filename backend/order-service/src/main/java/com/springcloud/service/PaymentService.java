package com.springcloud.service;

import com.springcloud.dto.PaymentRequest;
import com.springcloud.model.Order;
import com.springcloud.repository.OrderRepository;
import com.springcloud.common.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;


    /**
     * Buyer makes payment for an order. Sets status to PROCESSING if successful.
     */
    public Order makePayment(Long userId, PaymentRequest request) {
        Long orderId = request.orderId();
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new IllegalArgumentException("Order not found");
        }
        Order order = orderOpt.get();
        // Only buyer can pay for their order
        if (!order.getBuyerId().equals(userId)) {
            throw new SecurityException("You are not authorized to pay for this order");
        }
        // Only allow payment if order is PENDING
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Order is not in a payable state");
        }
        // Simulate payment processing (in real app, integrate with payment gateway)
        // For now, just set status to PROCESSING
        order.setStatus(OrderStatus.PROCESSING);
        // Optionally set paymentId, here just a dummy value
        order.setPaymentId("PAY-" + orderId + "-" + System.currentTimeMillis());
        orderRepository.save(order);
        return order;
    }

}
