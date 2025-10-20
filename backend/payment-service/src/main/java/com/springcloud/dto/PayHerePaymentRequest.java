package com.springcloud.dto;

import java.math.BigDecimal;

public record PayHerePaymentRequest(
    Long userId,
    String orderId,
    String items,
    String currency,
    BigDecimal amount,
    String firstName,
    String lastName,
    String email,
    String phone,
    String address,
    String city,
    String country,
    String returnUrl,
    String cancelUrl,
    String custom1,
    String custom2
) {}
