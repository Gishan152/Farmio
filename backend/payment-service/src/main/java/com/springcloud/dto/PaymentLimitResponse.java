package com.springcloud.dto;

import java.math.BigDecimal;

public record PaymentLimitResponse(
    Long userId,
    BigDecimal dailyLimit,
    BigDecimal monthlyLimit,
    BigDecimal transactionLimit,
    BigDecimal dailyUsed,
    BigDecimal monthlyUsed
) {}
