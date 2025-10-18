package com.springcloud.dto;

import java.math.BigDecimal;
import java.util.Map;

public record PaymentReport(
    BigDecimal totalAmount,
    Long totalTransactions,
    Map<String, Long> transactionsByType,
    Map<String, BigDecimal> amountsByType,
    String period
) {}
