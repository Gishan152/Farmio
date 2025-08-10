package com.springcloud.service;

import com.springcloud.dto.UserDTO;
import com.springcloud.dto.UserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserAnalyticsService {
    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth.service.url}")
    private String authServiceUrl;

    public List<UserDTO> fetchAllUsers() {
        try {
            ResponseEntity<UserDTO[]> response = restTemplate.getForEntity(authServiceUrl, UserDTO[].class);
            if (response.getBody() != null) {
                return Arrays.asList(response.getBody());
            } else {
                return Collections.emptyList();
            }
        } catch (RestClientException e) {
            // Log error in real application
            System.err.println("Error fetching users from auth service: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public Map<String, Long> getUserCountByStatus() {
        List<UserDTO> users = fetchAllUsers();
        return users.stream()
                .collect(Collectors.groupingBy(
                    user -> user.getStatus() != null ? user.getStatus() : "UNKNOWN",
                    Collectors.counting()
                ));
    }

    public long getTotalUserCount() {
        return fetchAllUsers().size();
    }

    public List<UserDTO> getUsersByStatus(String status) {
        List<UserDTO> users = fetchAllUsers();
        return users.stream()
                .filter(user -> status.equals(user.getStatus()))
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByRole(String role) {
        List<UserDTO> users = fetchAllUsers();
        return users.stream()
                .filter(user -> user.getRoles() != null && user.getRoles().contains(role))
                .collect(Collectors.toList());
    }

    public void deactivateUser(UserRequest request) {
        try {
            // First, find the user by ID to get the username
            List<UserDTO> users = fetchAllUsers();
            UserDTO user = users.stream()
                    .filter(u -> u.getId().equals(request.userId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("User with ID " + request.userId() + " not found"));
            
            // Create auth-service UserRequest with username
            com.springcloud.dto.AuthUserRequest authRequest = new com.springcloud.dto.AuthUserRequest(user.getUsername());
            
            // Call the auth-service deactivate endpoint
            String deactivateUrl = authServiceUrl.replace("/all-dto", "/deactivate");
            restTemplate.postForEntity(deactivateUrl, authRequest, Void.class);
            System.out.println("User deactivated successfully: " + user.getUsername());
        } catch (RestClientException e) {
            System.err.println("Error deactivating user: " + e.getMessage());
            throw new RuntimeException("Failed to deactivate user", e);
        }
    }

    public void approveUser(UserRequest request) {
        try {
            // First, find the user by ID to get the username
            List<UserDTO> users = fetchAllUsers();
            UserDTO user = users.stream()
                    .filter(u -> u.getId().equals(request.userId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("User with ID " + request.userId() + " not found"));
            
            // Create auth-service UserRequest with username
            com.springcloud.dto.AuthUserRequest authRequest = new com.springcloud.dto.AuthUserRequest(user.getUsername());
            
            // Call the auth-service approve endpoint
            String approveUrl = authServiceUrl.replace("/all-dto", "/approve");
            restTemplate.postForEntity(approveUrl, authRequest, Void.class);
            System.out.println("User approved successfully: " + user.getUsername());
        } catch (RestClientException e) {
            System.err.println("Error approving user: " + e.getMessage());
            throw new RuntimeException("Failed to approve user", e);
        }
    }

    public Map<String, Long> getUserCountByRole() {
        List<UserDTO> users = fetchAllUsers();
        return users.stream()
                .flatMap(user -> user.getRoles() != null ? user.getRoles().stream() : java.util.stream.Stream.empty())
                .collect(Collectors.groupingBy(
                    java.util.function.Function.identity(),
                    Collectors.counting()
                ));
    }
}

