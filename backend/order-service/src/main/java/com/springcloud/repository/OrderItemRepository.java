package com.springcloud.repository;

import com.springcloud.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Fetch all items for a given order
    List<OrderItem> findByOrderOrderId(Long orderId);
}
