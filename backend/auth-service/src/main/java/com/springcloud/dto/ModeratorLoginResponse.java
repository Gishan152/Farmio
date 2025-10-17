package com.springcloud.dto;

public record ModeratorLoginResponse(
    String token,
    boolean isFirstLogin,
    String email,
    String role
) {}
