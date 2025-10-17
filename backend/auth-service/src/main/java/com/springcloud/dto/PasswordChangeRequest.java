package com.springcloud.dto;

public record PasswordChangeRequest(
    String email,
    String temporaryPassword,
    String newPassword
) {}
