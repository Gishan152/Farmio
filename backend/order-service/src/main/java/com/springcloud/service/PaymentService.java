package com.springcloud.service;

import com.springcloud.dto.PaymentRequest;
import com.springcloud.model.Order;
import com.springcloud.repository.OrderRepository;
import com.springcloud.common.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

// Add Feign client import
import com.springcloud.feign.PaymentServiceClient;
import com.springcloud.dto.PaymentInitiationRequest;
import com.springcloud.dto.PayHerePaymentResponse;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentServiceClient paymentServiceClient;


    /**
     * Buyer makes payment for an order. Calls payment-service to initialize payment.
     */
    public PayHerePaymentResponse makePayment(Long userId, PaymentRequest request) {
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

        System.out.println("making payment for order: " + orderId);
        // Prepare payment initiation request
        PaymentInitiationRequest paymentInitRequest = new PaymentInitiationRequest(
            order.getId().toString(),
            order.getTotalAmount(),
            order.getBuyerId(),
            order.getSellerId(),
            "ORDER",
            80.0, // 20% to seller, 80% to escrow
            "Order payment for " + order.getId()
        );
        // Call payment-service via Feign client
        System.out.println("Initiating payment for order: " + paymentInitRequest);
        PayHerePaymentResponse response = paymentServiceClient.initiatePayment(paymentInitRequest);
        System.out.println("Payment initiation response: " + response.hash());
        // Return payment initiation response to client
        return response;
    }

    public ResponseEntity<?> getPaymentStatusByReference(String reference) {
        return paymentServiceClient.getPaymentStatusByReference(reference);
    }
}
