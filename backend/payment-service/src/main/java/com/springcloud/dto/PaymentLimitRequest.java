package com.springcloud.dto;

import java.math.BigDecimal;

public record PaymentLimitRequest(
    Long userId,
    BigDecimal dailyLimit,
    BigDecimal monthlyLimit,
    BigDecimal transactionLimit
) {}
