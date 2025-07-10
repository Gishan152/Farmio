package com.springcloud.service;

import com.springcloud.dto.*;
import com.springcloud.model.Order;
import com.springcloud.model.OrderItem;
import com.springcloud.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public AuthResponse create(Long userId, CreateOrderRequest request) {

//        var items = request.items();
//
//
//
//        var order = Order.builder()
//                .farmerId(Long.valueOf("1"))
//                .buyerId(userId)
//                .paymentStatus("PENDING")
//
//                .build();
//        orderRepository.save(user);


        return new AuthResponse("jwtToken");
    }

//    public AuthResponse authenticate(OrderRequest request) {
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        request.username(),
//                        request.password()
//                )
//        );
//        var user = orderRepository.findByUsername(request.username())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        if(user.getStatus().equals("PENDING")){
//            Map<String, Object> extraClaims = new HashMap<>();
//            extraClaims.put("isTemp", true);
//            var jwtToken = jwtService.generateToken(extraClaims, user);
//            return new AuthResponse(jwtToken);
//        }
//        var jwtToken = jwtService.generateToken(user);
//        return new AuthResponse(jwtToken);
//    }
//
//    public PublicUserData getUser(UserRequest request){
//        var user = orderRepository.findByUsername(request.username())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        return new PublicUserData(user.getUsername(), user.getId(), user.getEmail(), user.getStatus(), user.getPhoneNo());
//    }
}