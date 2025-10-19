package com.springcloud.repository;

import com.springcloud.model.Order;
import com.springcloud.common.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Find all orders for a specific farmer
    List<Order> findByFarmerId(Long farmerId);

    List<Order> findByBuyerId(Long farmerId);

    // Find all orders by payment status
    List<Order> findByStatus(String status);
    
    // Find order by payment ID (reference)
    Optional<Order> findByPaymentId(String paymentId);
    
    // Find order by payment ID (reference)
    Optional<Order> findByOrderId(Long paymentId);

    List<Order> findByFarmerIdAndStatusIn(Long farmerId, java.util.Collection<OrderStatus> statuses);

    List<Order> findByFarmerIdAndStatus(Long farmerId, OrderStatus status);
}
