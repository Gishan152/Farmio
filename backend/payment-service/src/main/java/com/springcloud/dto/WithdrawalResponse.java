package com.springcloud.dto;

import java.math.BigDecimal;

public record WithdrawalResponse(
    String withdrawalId,
    Long userId,
    BigDecimal amount,
    String status,
    String message
) {}
