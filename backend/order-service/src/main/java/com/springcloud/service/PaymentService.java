package com.springcloud.service;

import com.springcloud.dto.PaymentRequest;
import com.springcloud.model.Order;
import com.springcloud.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;

    void initializePayment(Long userId, PaymentRequest request){
        Long orderId = request.orderId();
        Optional<Order> order = orderRepository.findById(orderId);

    }

}
