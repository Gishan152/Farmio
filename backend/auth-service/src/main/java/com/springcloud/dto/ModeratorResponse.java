package com.springcloud.dto;

public record ModeratorResponse(
    Long id,
    String username,
    String email,
    String message
) {}
