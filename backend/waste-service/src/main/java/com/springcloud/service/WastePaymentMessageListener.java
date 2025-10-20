package com.springcloud.service;

import com.springcloud.dto.PaymentConfirmedMessage;
import com.springcloud.model.Payment;
import com.springcloud.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class WastePaymentMessageListener {

    private final PaymentRepository paymentRepository;

    @RabbitListener(queues = "waste.payment.confirmed.queue")
    @Transactional
    public void handlePaymentConfirmed(PaymentConfirmedMessage message) {
        try {
            log.info("[WASTE] Received payment confirmation for reference: {}", message.reference());
            System.out.println("[WASTE] Received payment confirmation for reference: " + message.reference());

            // In WASTE flow, 'reference' is the Payment ID in waste-service
            Long paymentId = Long.valueOf(message.reference());

            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new IllegalStateException("Waste payment not found for reference " + message.reference()));

            if ("PAID".equalsIgnoreCase(payment.getStatus())) {
                log.info("Waste payment {} already PAID. Skipping update.", paymentId);
                return;
            }

            payment.setStatus("PAID");
            if (message.paymentId() != null && !message.paymentId().isBlank()) {
                payment.setTransactionRef(message.paymentId());
            }
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            log.info("Waste payment {} marked as PAID", paymentId);
        } catch (Exception e) {
            log.error("[WASTE] Error processing payment confirmation message", e);
            throw e; // let container handle retries/DLQ
        }
    }
}
