package com.springcloud.repository;

import com.springcloud.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Find all orders for a specific farmer
    List<Order> findByFarmerId(Long farmerId);

    List<Order> findByBuyerId(Long farmerId);

    // Find all orders by payment status
    List<Order> findByPaymentStatus(String paymentStatus);
}
