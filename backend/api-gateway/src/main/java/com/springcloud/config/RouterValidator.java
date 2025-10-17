package com.springcloud.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class RouterValidator {
    private static final List<String> openEndpoints = Arrays.asList(
        "/api/auth/",
        "/actuator/health",
        "/api/warehouses", // Temporarily open for testing
        "/api/slots",
        "/auth/login", 
        "/auth/register",
        "/api/analytics/admin/users", 
        "/api/analytics/admin/users/count",
        "/api/analytics/admin/users/status-count",
        "/api/analytics/admin/users/by-status",
        "/api/analytics/admin/orders",
        "/api/analytics/admin/orders/count",
        "/api/analytics/admin/orders/status-count",
        "/api/analytics/admin/orders/by-status",
        "/api/analytics/admin/products",
        "/api/analytics/admin/moderators", 
        "/api/analytics/prices",
        "/api/analytics/prices/category",
        "/api/analytics/moderator/prices",
        "/api/order/get-crops",
        "/api/user/all-dto",
        "/api/admin/moderators/all-dto",
        "/api/moderator/login",
        "/api/moderator/change-temp-password"
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
