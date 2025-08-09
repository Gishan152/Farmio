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
        "/api/analytics/admin/users", 
        "/api/analytics/admin/users/count",
        "/api/analytics/admin/users/status-count",
        "/api/analytics/admin/users/by-status"
    );

    public boolean isSecured(ServerHttpRequest request) {
        return openEndpoints.stream()
                .noneMatch(uri -> request.getURI().getPath().contains(uri));
    }
}
