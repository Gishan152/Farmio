package com.springcloud.dto;

/**
 * DTO for transferring activity log data to the frontend
 */
public record ActivityLogDTO(
    Long id,
    String date,
    String action,
    String details
) {
}
