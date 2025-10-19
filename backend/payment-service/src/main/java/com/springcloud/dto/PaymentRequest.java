package com.springcloud.dto;

import java.math.BigDecimal;

public record PaymentRequest(
    Long userId,
    BigDecimal amount,
    String type,
    String reference,
    String description,
    Long recipientId
) {}
