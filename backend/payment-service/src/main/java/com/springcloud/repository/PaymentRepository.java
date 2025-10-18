package com.springcloud.repository;

import com.springcloud.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByPayerId(Long payerId);
    
    List<Payment> findByPayeeId(Long payeeId);
    
    List<Payment> findByOrderId(Long orderId);
    
    List<Payment> findByStatus(String status);
    
    List<Payment> findByPaymentMethod(String paymentMethod);
    
    List<Payment> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}