package com.springcloud.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionHistory(
    String transactionId,
    BigDecimal amount,
    String type,
    String status,
    String reference,
    LocalDateTime timestamp,
    String description
) {}
