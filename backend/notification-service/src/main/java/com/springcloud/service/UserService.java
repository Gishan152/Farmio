package com.springcloud.service;

import com.springcloud.client.AuthServiceClient;
import com.springcloud.dto.PublicUserData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    
    private final AuthServiceClient authServiceClient;
    
    public String getUserEmail(String userId) {
        try {
            log.debug("Getting email for user: {}", userId);
            PublicUserData user = authServiceClient.getUserById(Long.parseLong(userId));
            return user.email();
        } catch (Exception e) {
            log.error("Failed to get user email for userId: {}", userId, e);
            return "user" + userId + "@example.com"; // Fallback to mock email
        }
    }
    
    public String getUserName(String userId) {
        try {
            log.debug("Getting name for user: {}", userId);
            PublicUserData user = authServiceClient.getUserById(Long.parseLong(userId));
            return user.username();
        } catch (Exception e) {
            log.error("Failed to get user name for userId: {}", userId, e);
            return "User " + userId; // Fallback to mock name
        }
    }
}