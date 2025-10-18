package com.springcloud.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Service
@Slf4j
public class UserService {
    
    // For now, we'll use a mock implementation
    // In production, this would use Feign client to call auth-service
    
    public String getUserEmail(String userId) {
        try {
            // TODO: Implement Feign client call to auth-service
            // return userFeignClient.getUserEmail(userId);
            
            // Mock implementation for now
            log.debug("Getting email for user: {}", userId);
            return "user" + userId + "@example.com"; // Mock email
        } catch (Exception e) {
            log.error("Failed to get user email for userId: {}", userId, e);
            return null;
        }
    }
    
    public String getUserName(String userId) {
        try {
            // TODO: Implement Feign client call to auth-service
            // return userFeignClient.getUserName(userId);
            
            // Mock implementation for now
            log.debug("Getting name for user: {}", userId);
            return "User " + userId; // Mock name
        } catch (Exception e) {
            log.error("Failed to get user name for userId: {}", userId, e);
            return "User";
        }
    }
}

// TODO: Uncomment and implement when auth-service API is ready
/*
@FeignClient(name = "auth-service")
interface UserFeignClient {
    
    @GetMapping("/api/users/{userId}/email")
    String getUserEmail(@PathVariable("userId") String userId);
    
    @GetMapping("/api/users/{userId}/name")
    String getUserName(@PathVariable("userId") String userId);
    
    @GetMapping("/api/users/{userId}")
    UserDto getUser(@PathVariable("userId") String userId);
}
*/