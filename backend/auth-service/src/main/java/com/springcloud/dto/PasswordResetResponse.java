package com.springcloud.dto;

public record PasswordResetResponse(
    String temporaryPassword,
    String message
) {}
