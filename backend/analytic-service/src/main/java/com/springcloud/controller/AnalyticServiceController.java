package com.springcloud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import com.springcloud.dto.UserDTO;
import com.springcloud.dto.UserRequest;
import com.springcloud.dto.OrderDTO;
import com.springcloud.dto.ProductDTO;
import com.springcloud.service.UserAnalyticsService;
import com.springcloud.service.OrderAnalyticsService;
import com.springcloud.service.ProductAnalyticsService;
import com.springcloud.service.ModeratorAnalyticsService;
import com.springcloud.dto.ModeratorDTO;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticServiceController {
    @Autowired
    private UserAnalyticsService userAnalyticsService;

    @Autowired
    private OrderAnalyticsService orderAnalyticsService;

    @Autowired
    private ProductAnalyticsService productAnalyticsService;
    
    @Autowired
    private ModeratorAnalyticsService moderatorAnalyticsService;

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Analytic Service!";
    }


    //get the products from the crop listing service
    @GetMapping("/admin/products")
    public ResponseEntity<List<ProductDTO>> getAllProductsForAdmin() {
        List<ProductDTO> products = productAnalyticsService.fetchAllProducts();
        return ResponseEntity.ok(products);
    }
    
    // Check if a product can be deleted (not used in any orders)
    @GetMapping("/admin/products/{productId}/can-delete")
    public ResponseEntity<Map<String, Object>> canDeleteProduct(@PathVariable Long productId) {
        boolean canDelete = productAnalyticsService.checkProductCanBeDeleted(productId);
        Map<String, Object> response = Map.of(
            "canDelete", canDelete,
            "message", canDelete ? 
                "Product can be safely deleted." : 
                "Cannot delete this product as it is associated with existing orders."
        );
        return ResponseEntity.ok(response);
    }
    
    // Delete a product from crop-listing-service
    @DeleteMapping("/admin/products/{productId}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long productId) {
        boolean canDelete = productAnalyticsService.checkProductCanBeDeleted(productId);
        
        if (!canDelete) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Cannot delete this product as it is associated with existing orders."
            );
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean deleted = productAnalyticsService.deleteProduct(productId);
        
        Map<String, Object> response = Map.of(
            "success", deleted,
            "message", deleted ? 
                "Product deleted successfully." : 
                "Failed to delete the product. Please try again."
        );
        
        return deleted ? ResponseEntity.ok(response) : ResponseEntity.internalServerError().body(response);
    }

    // Order endpoints
    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrdersForAdmin() {
        List<OrderDTO> orders = orderAnalyticsService.fetchAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/admin/orders/count")
    public ResponseEntity<Long> getTotalOrderCount() {
        long count = orderAnalyticsService.getTotalOrderCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/admin/orders/status-count")
    public ResponseEntity<Map<String, Long>> getOrderCountByStatus() {
        Map<String, Long> statusCounts = orderAnalyticsService.getOrderCountByStatus();
        return ResponseEntity.ok(statusCounts);
    }

    @GetMapping("/admin/orders/by-status")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@RequestParam String status) {
        List<OrderDTO> orders = orderAnalyticsService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    // User endpoints
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
    
    // Moderator endpoints
    @GetMapping("/admin/moderators")
    public ResponseEntity<List<ModeratorDTO>> getAllModerators() {
        List<ModeratorDTO> moderators = moderatorAnalyticsService.fetchAllModerators();
        return ResponseEntity.ok(moderators);
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
