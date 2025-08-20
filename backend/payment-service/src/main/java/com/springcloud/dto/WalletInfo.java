package com.springcloud.dto;

import java.math.BigDecimal;
import java.util.List;

public record WalletInfo(
    Long userId,
    BigDecimal amount,
    BigDecimal escrowAmount,
    String status,
    List<TransactionHistory> paymentHistory
) {}
