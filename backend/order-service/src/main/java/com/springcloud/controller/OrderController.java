package com.springcloud.controller;

import com.springcloud.dto.CreateOrderRequest;
import com.springcloud.dto.AuthResponse;
import com.springcloud.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
//@RequiredArgsConstructor
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<AuthResponse> createOrder(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Name") String userName,
            @RequestHeader("X-Roles") String rolesCsv,
            @RequestBody CreateOrderRequest request
    ) {

        System.out.println("User Id : " + userId);
        System.out.println("User name : " + userName);
        System.out.println("User name : " + rolesCsv);

        return ResponseEntity.ok(new AuthResponse("jdslkf"));
    }

//    @PostMapping("/create")
//    public ResponseEntity<AuthResponse> createOrder(
//            HttpServletRequest request,
//            @RequestBody CreateOrderRequest req
//    ) {
//        String userId = request.getHeader("X-User-Id");
//        String rolesCsv = request.getHeader("X-Roles");
//        // Must check manually and possibly return error if headers missing
//        return ResponseEntity.ok(orderService.create(req, userId, rolesCsv));
//    }

}