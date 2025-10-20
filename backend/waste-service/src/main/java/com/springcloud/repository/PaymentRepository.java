package com.springcloud.repository;

import com.springcloud.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	List<Payment> findByAgentId(Long agentId);
}
