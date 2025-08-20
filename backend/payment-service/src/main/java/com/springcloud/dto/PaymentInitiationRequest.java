package com.springcloud.dto;

import java.math.BigDecimal;

public record PaymentInitiationRequest(
    String reference,
    BigDecimal amount,
    Long payerId,
    Long payeeId,
    BigDecimal escrowPercentage,
    String firstName,
    String lastName,
    String email,
    String phone,
    String address,
    String city,
    String country,
    String returnUrl,
    String cancelUrl,
    String description
) {}
