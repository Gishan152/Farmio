package com.springcloud.service;

import com.springcloud.model.Payment;
import com.springcloud.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + id));
    }

    // ✅ Update status and optionally add transaction details
    public Payment updatePaymentStatus(Long id, String status, String method, String transactionRef) {
        Payment payment = getPaymentById(id);
        payment.setStatus(status);

        if (method != null) {
            payment.setPaymentMethod(method);
        }
        if (transactionRef != null) {
            payment.setTransactionRef(transactionRef);
        }

        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }
}
