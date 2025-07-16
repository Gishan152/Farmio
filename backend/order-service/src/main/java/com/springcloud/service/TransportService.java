package com.springcloud.service;

import com.springcloud.common.enums.OrderStatus;
import com.springcloud.exception.ResourceNotFoundException;
import com.springcloud.model.Transport;
import com.springcloud.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.EnumSet;

@Service
@RequiredArgsConstructor
public class TransportService {

    private final OrderRepository orderRepository;

    public void addTransport(Long userId, Long orderId) {
        orderRepository.findById(orderId)
                .map(order -> {
                    if(!order.getBuyerId().equals(userId)){
                        throw new RuntimeException("Unauthorized");
                    }
                    OrderStatus status = order.getStatus();
                    if (!EnumSet.of(OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.AWAITING_PICKUP).contains(status)) {
                        throw new IllegalStateException(
                                "Cannot add transport in the current state: " + status
                        );
                    }

                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found"));
    }
}
