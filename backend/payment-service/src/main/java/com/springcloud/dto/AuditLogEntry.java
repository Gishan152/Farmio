package com.springcloud.dto;

import java.time.LocalDateTime;

public record AuditLogEntry(
    Long userId,
    String action,
    LocalDateTime timestamp,
    String details
) {}
