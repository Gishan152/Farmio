package com.springcloud.repository;

import com.springcloud.entity.Payment;
import com.springcloud.common.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByReference(String reference);
    List<Payment> findByPayerId(Long payerId);
    List<Payment> findByPayerIdAndStatus(Long payerId, PaymentStatus status);
    List<Payment> findByStatus(PaymentStatus status);
}
