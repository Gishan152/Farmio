package com.springcloud.service;

import com.springcloud.config.RabbitMQConfig;
import com.springcloud.dto.PaymentConfirmedMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentMessagePublisher {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void publishPaymentConfirmed(PaymentConfirmedMessage message) {
        try {
            System.out.println("Publishing payment confirmation message: " + message.reference());
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.PAYMENT_EXCHANGE,
                RabbitMQConfig.PAYMENT_CONFIRMED_ROUTING_KEY,
                message
            );
            System.out.println("Payment confirmation message published successfully");
        } catch (Exception e) {
            System.err.println("Failed to publish payment confirmation message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void publishWastePaymentConfirmed(PaymentConfirmedMessage message) {
        try {
            System.out.println("Publishing WASTE payment confirmation message: " + message.reference());
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.WASTE_PAYMENT_EXCHANGE,
                RabbitMQConfig.WASTE_PAYMENT_CONFIRMED_ROUTING_KEY,
                message
            );
            System.out.println("WASTE payment confirmation message published successfully");
        } catch (Exception e) {
            System.err.println("Failed to publish WASTE payment confirmation message: " + e.getMessage());
            e.printStackTrace();
        }
    }
}