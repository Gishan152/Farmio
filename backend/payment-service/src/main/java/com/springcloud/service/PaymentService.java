package com.springcloud.service;

import com.springcloud.model.Payment;
import com.springcloud.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    /**
     * Create a new payment record
     */
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }
    
    /**
     * Get all payments
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    /**
     * Get payment by ID
     */
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }
    
    /**
     * Get payments by payer ID (customer/buyer)
     */
    public List<Payment> getPaymentsByPayerId(Long payerId) {
        return paymentRepository.findByPayerId(payerId);
    }
    
    /**
     * Get payments by payee ID (farmer/seller)
     */
    public List<Payment> getPaymentsByPayeeId(Long payeeId) {
        return paymentRepository.findByPayeeId(payeeId);
    }
    
    /**
     * Get payments by order ID
     */
    public List<Payment> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }
    
    /**
     * Get payments by status
     */
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status);
    }
    
    /**
     * Get payments by date range
     */
    public List<Payment> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    /**
     * Update payment status
     */
    public Payment updatePaymentStatus(Long id, String status) {
        Optional<Payment> paymentOpt = paymentRepository.findById(id);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setStatus(status);
            return paymentRepository.save(payment);
        }
        return null;
    }
    
    /**
     * Calculate total payment amount
     */
    public BigDecimal calculateTotalPaymentAmount() {
        List<Payment> payments = paymentRepository.findByStatus("COMPLETED");
        return payments.stream()
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Get payment statistics
     */
    public Map<String, Object> getPaymentStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total payments
        stats.put("totalCount", paymentRepository.count());
        
        // Payments by status
        stats.put("completed", paymentRepository.findByStatus("COMPLETED").size());
        stats.put("pending", paymentRepository.findByStatus("PENDING").size());
        stats.put("failed", paymentRepository.findByStatus("FAILED").size());
        stats.put("refunded", paymentRepository.findByStatus("REFUNDED").size());
        
        // Total amount
        stats.put("totalAmount", calculateTotalPaymentAmount());
        
        return stats;
    }
}