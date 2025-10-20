package com.springcloud.dto;

import java.math.BigDecimal;

public record PaymentStatistics(
    BigDecimal totalAmount,
    BigDecimal totalRevenue,
    Integer transactionCount,
    BigDecimal totalEscrowAmount,
    Integer successfulPayments,
    Integer failedPayments,
    Integer pendingPayments,
    BigDecimal totalWithdrawals
) {}
