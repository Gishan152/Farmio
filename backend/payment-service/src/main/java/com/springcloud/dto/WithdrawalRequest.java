package com.springcloud.dto;

import java.math.BigDecimal;

public record WithdrawalRequest(
    Long userId,
    BigDecimal amount,
    String description
) {}
