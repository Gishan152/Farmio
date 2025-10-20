package com.springcloud.dto;

public record PaymentStatusResponse(
    String paymentId,
    String status,
    String message
) {}
