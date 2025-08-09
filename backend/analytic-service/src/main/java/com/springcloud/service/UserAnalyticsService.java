package com.springcloud.service;

import com.springcloud.dto.UserDTO;
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

