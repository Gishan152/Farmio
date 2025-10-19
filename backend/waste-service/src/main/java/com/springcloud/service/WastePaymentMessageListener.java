package com.springcloud.service;

import com.springcloud.model.Payment;
import com.springcloud.repository.PaymentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@ConditionalOnProperty(name = "spring.rabbitmq.host")
public class WastePaymentMessageListener {

    private final PaymentRepository paymentRepository;

    public WastePaymentMessageListener(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    /**
     * Listen for payment confirmations related to waste agent payouts and mark the payment as PAID.
     * Queue name chosen to be descriptive and scoped to waste payments.
     */
    @RabbitListener(queues = "waste.payment.confirmed.queue")
    @Transactional
    public void handlePaymentConfirmed(PaymentConfirmedMessage message) {
        // message.reference is expected to be the Payment ID in waste-service
        Long paymentId;
        try {
            paymentId = Long.valueOf(message.reference());
        } catch (NumberFormatException nfe) {
            log.error("Invalid payment reference received: {}", message.reference());
            // Bubble up so broker can retry/DLQ according to policy
            throw nfe;
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalStateException("Waste payment not found for reference " + message.reference()));

        // Idempotency: if already PAID, no-op
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
    }

    // Local projection of the cross-service message to avoid tight coupling
    public record PaymentConfirmedMessage(
            String reference,
            java.math.BigDecimal amount,
            String paymentId,
            String status,
            java.time.LocalDateTime timestamp,
            Long payerId,
            Long payeeId
    ) {}
}
