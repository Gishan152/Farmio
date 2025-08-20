package com.springcloud.dto;

public record PayHerePaymentResponse(
    String status,
    String message,
    String checkoutUrl,
    String orderId,
    String hash
) {}
