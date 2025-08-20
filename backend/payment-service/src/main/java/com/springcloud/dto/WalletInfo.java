package com.springcloud.dto;

import java.math.BigDecimal;

public record WalletInfo(
    Long userId,
    BigDecimal balance,
    BigDecimal escrowedAmount,
    String status
) {}
