package com.springcloud.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Feign client to talk to auth-service for public user data.
 * Service name should match the registration in Eureka.
 */
@FeignClient(name = "auth-service", path = "/api/user")
public interface AuthClient {

    @PostMapping(value = "/get", consumes = MediaType.APPLICATION_JSON_VALUE)
    PublicUserData getUser(@RequestBody UserRequest request);

    // Local DTOs to avoid coupling waste-service to auth-service classes directly
    record UserRequest(String username) {}
    record PublicUserData(String username, Long id, String email, String status, String phoneNo) {}
}
