package com.springcloud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import com.springcloud.dto.UserDTO;
import com.springcloud.dto.UserRequest;
import com.springcloud.service.UserAnalyticsService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticServiceController {
    @Autowired
    private UserAnalyticsService userAnalyticsService;

    //get the all orders
    // @GetMapping("/orders")
    // public ResponseEntity<List<Order>> getAllOrders() {
    //     List<Order> orders = orderService.getAllOrders();
    //     return ResponseEntity.ok(orders);
    // }

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Analytic Service!";
    }

    @GetMapping("/admin/users")
    public ResponseEntity<List<UserDTO>> getAllUsersForAdmin() {
        List<UserDTO> users = userAnalyticsService.fetchAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/admin/users/count")
    public ResponseEntity<Long> getTotalUserCount() {
        long count = userAnalyticsService.getTotalUserCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/admin/users/status-count")
    public ResponseEntity<Map<String, Long>> getUserCountByStatus() {
        Map<String, Long> statusCounts = userAnalyticsService.getUserCountByStatus();
        return ResponseEntity.ok(statusCounts);
    }

    @GetMapping("/admin/users/by-status")
    public ResponseEntity<List<UserDTO>> getUsersByStatus(@RequestParam String status) {
        List<UserDTO> users = userAnalyticsService.getUsersByStatus(status);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/admin/users/by-role")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@RequestParam String role) {
        List<UserDTO> users = userAnalyticsService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/admin/users/role-count")
    public ResponseEntity<Map<String, Long>> getUserCountByRole() {
        Map<String, Long> roleCounts = userAnalyticsService.getUserCountByRole();
        return ResponseEntity.ok(roleCounts);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsersFromAuthService() {
        List<UserDTO> users = userAnalyticsService.fetchAllUsers();
        return ResponseEntity.ok(users);
    }

    //deactivate the user
    @PostMapping("/admin/users/deactivate")
    public ResponseEntity<Void> deactivateUser(@RequestBody UserRequest request) {
        userAnalyticsService.deactivateUser(request);
        return ResponseEntity.noContent().build();
    }

    //approve the user
    @PostMapping("/admin/users/approve")
    public ResponseEntity<Void> approveUser(@RequestBody UserRequest request) {
        userAnalyticsService.approveUser(request);
        return ResponseEntity.noContent().build();
    }

    //activate the user (specifically for buyers)
    @PostMapping("/admin/users/activate")
    public ResponseEntity<Void> activateUser(@RequestBody UserRequest request) {
        userAnalyticsService.activateUser(request);
        return ResponseEntity.noContent().build();
    }
}
