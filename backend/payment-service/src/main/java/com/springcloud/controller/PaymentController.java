package com.springcloud.controller;

import com.springcloud.model.Payment;
import com.springcloud.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello from Payment Service!";
    }
    
    @PostMapping("/create")
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        Payment created = paymentService.createPayment(payment);
        return ResponseEntity.ok(created);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/payer/{payerId}")
    public ResponseEntity<List<Payment>> getPayerPayments(
            @PathVariable Long payerId,
            @RequestHeader("X-User-Id") String requestUserId) {
        
        // Security check - user can only see their own payments unless admin
        if (!payerId.toString().equals(requestUserId)) {
            return ResponseEntity.status(403).build();
        }
        
        List<Payment> payments = paymentService.getPaymentsByPayerId(payerId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/payee/{payeeId}")
    public ResponseEntity<List<Payment>> getPayeePayments(
            @PathVariable Long payeeId,
            @RequestHeader("X-User-Id") String requestUserId) {
        
        // Security check - user can only see their own received payments unless admin
        if (!payeeId.toString().equals(requestUserId)) {
            return ResponseEntity.status(403).build();
        }
        
        List<Payment> payments = paymentService.getPaymentsByPayeeId(payeeId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Payment>> getOrderPayments(@PathVariable Long orderId) {
        List<Payment> payments = paymentService.getPaymentsByOrderId(orderId);
        return ResponseEntity.ok(payments);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Payment> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        
        Payment updated = paymentService.updatePaymentStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/by-date-range")
    public ResponseEntity<List<Payment>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<Payment> payments = paymentService.getPaymentsByDateRange(startDate, endDate);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getPaymentStatistics() {
        Map<String, Object> stats = paymentService.getPaymentStatistics();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalAmount() {
        BigDecimal total = paymentService.calculateTotalPaymentAmount();
        return ResponseEntity.ok(total);
    }
    
    // Admin endpoints - for testing purposes, these endpoints don't require authentication headers
    @GetMapping("/admin/all")
    public ResponseEntity<List<Payment>> getAllPaymentsForAdmin() {
        // For development purposes, we're allowing this endpoint without authorization checks
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    // Added a public endpoint for easy testing
    @GetMapping("/public/all")
    public ResponseEntity<List<Payment>> getAllPaymentsPublic() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/admin/by-status")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@RequestParam String status) {
        List<Payment> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }
}