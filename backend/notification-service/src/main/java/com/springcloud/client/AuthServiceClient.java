package com.springcloud.client;

import com.springcloud.dto.PublicUserData;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service")
public interface AuthServiceClient {
    
    @GetMapping("/api/user/{userId}")
    PublicUserData getUserById(@PathVariable("userId") Long userId);
}
