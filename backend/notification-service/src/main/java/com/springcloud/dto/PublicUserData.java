package com.springcloud.dto;

public record PublicUserData(
    String username,
    Long id,
    String email,
    String status,
    String phoneNo
) {
}
