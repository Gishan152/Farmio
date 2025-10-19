package com.springcloud.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class RouterValidator {
    private static final List<String> openEndpoints = Arrays.asList(
        "/auth/login", 
        "/auth/register",
        "/api/payment/payhere/notify",
        "/api/analytics/admin/users",
        "/api/analytics/admin/users/count",
        "/api/analytics/admin/users/status-count",
        "/api/analytics/admin/users/by-status",
        "/api/analytics/admin/orders",
        "/api/analytics/admin/orders/count",
        "/api/analytics/admin/orders/status-count",
        "/api/analytics/admin/orders/by-status",
        "/api/analytics/admin/orders/recent",
        "/api/order/admin/all",
        "/api/analytics/admin/products",
        "/api/analytics/admin/products/can-delete",
        "/api/analytics/admin/moderators", 
        "/api/analytics/prices",
        "/api/analytics/prices/category",
        "/api/analytics/moderator/prices",
        "/api/order/get-crops",
        "/api/order/get",
        "/api/user/all-dto",
        
        "/api/admin/moderators/all-dto",
        "/api/moderator/login",
        "/api/analytics/admin/waste/listings",
        "/api/analytics/admin/waste/agents",
        "/api/analytics/admin/waste/listings/count",
        "/api/analytics/admin/waste/agents/count",
        "/api/analytics/admin/waste/listings/status-count",
        "/api/analytics/admin/waste/listings/by-status",
        "/api/analytics/admin/waste/listings/type-count",
        "/api/analytics/admin/waste/listings/by-type",
        "/api/moderator/change-temp-password",
        "/actuator/health",
        
        // Moderator endpoints - allow without authentication
        "/api/analytics/moderator/stats",
        "/api/analytics/moderator/recent-orders",
        "/api/analytics/moderator/pending-orders",
        "/api/analytics/moderator/products-for-review",
        "/api/analytics/moderator/recent-inventory-updates",
        "/api/analytics/moderator/orders",
        "/api/analytics/moderator/products"
    );

    public boolean isSecured(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        
        // Check if the path contains any of the explicitly open endpoints
        if (openEndpoints.stream().anyMatch(path::contains)) {
            return false;
        }
        
        // Special handling for moderator endpoints - allow all moderator price endpoints
        if (path.contains("/api/analytics/moderator/prices")) {
            return false;
        }
        
        return true;
    }
}
