package com.springcloud.controller;

import com.springcloud.dto.CreateOrderRequest;
import com.springcloud.model.CropInfo;
import com.springcloud.model.Order;
import com.springcloud.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
//@RequiredArgsConstructor
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<List<Order>> createOrder(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-Roles") String rolesCsv,
            @RequestBody CreateOrderRequest request
    ) {

        System.out.println("User Id : " + userId);
        System.out.println("User name : " + username);
        System.out.println("User name : " + rolesCsv);

        var orderList = orderService.create(Long.valueOf(userId), request);

        return ResponseEntity.ok(orderList);
    }

    @PostMapping("/cancel/:orderId")
    public ResponseEntity<Order> cancelOrder(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-Roles") String rolesCsv,
            @PathVariable Long orderId
    ) {
        var orderList = orderService.cancel(Long.valueOf(userId), orderId);

        return ResponseEntity.ok(orderList);
    }

    @PostMapping("/get")
    public ResponseEntity<List<Order>> getOrders(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-Roles") String rolesCsv
    ) {

        var orderList = orderService.get(Long.valueOf(userId), rolesCsv);

        return ResponseEntity.ok(orderList);
    }

    @PostMapping("get-crops")
    public ResponseEntity<List<CropInfo>> getCrops(){
        return ResponseEntity.ok(orderService.getCrops());
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