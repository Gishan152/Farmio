package com.springcloud.dto;

public record PaymentResponse(
    String status,
    String message,
    String transactionId,
    String paymentId
) {}
