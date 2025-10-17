package com.springcloud.service;

import com.springcloud.dto.PaymentConfirmedMessage;
import com.springcloud.model.Order;
import com.springcloud.common.enums.OrderStatus;
import com.springcloud.repository.OrderRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PaymentMessageListener {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @RabbitListener(queues = "payment.confirmed.queue")
    @Transactional
    public void handlePaymentConfirmed(PaymentConfirmedMessage message) {
        try {
            System.out.println("Received payment confirmation for reference: " + message.reference());
            
            // Find the order by payment ID (reference)
            Optional<Order> optionalOrder = orderRepository.findByOrderId(Long.valueOf(message.reference()));
            
            if (optionalOrder.isPresent()) {
                Order order = optionalOrder.get();
                
                // Update order status to PROCESSING (payment confirmed)
                order.setStatus(OrderStatus.PROCESSING);
                
                // Save the updated order
                orderRepository.save(order);
                
                System.out.println("Order " + order.getOrderId() + " status updated to PROCESSING due to payment confirmation");
                
            } else {
                System.err.println("Order not found for payment reference: " + message.reference());
            }
            
        } catch (Exception e) {
            System.err.println("Error processing payment confirmation message: " + e.getMessage());
            e.printStackTrace();
            // In production, you might want to implement proper error handling/retry logic
        }
    }
}