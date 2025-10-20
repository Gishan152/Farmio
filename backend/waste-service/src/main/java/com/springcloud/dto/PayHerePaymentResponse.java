package com.springcloud.dto;

public record PayHerePaymentResponse(
        String status,
        String message,
        String checkoutUrl,
        String orderId,
        String hash,
        String merchantId,
        String firstName,
        String lastName,
        String email,
        String phone,
        String address,
        String city,
        String country,
        String description,
        String currency,
        String amount
) {}
