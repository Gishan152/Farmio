package com.springcloud.dto;

import jakarta.validation.constraints.NotBlank;

public record PublicUserData(
    String username,
    Long id,
    String email,
    String status,
    String phoneNo
) {
}
