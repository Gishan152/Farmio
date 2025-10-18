package com.springcloud.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReceiptResponse(
    String receiptId,
    String paymentId,
    Long userId,
    BigDecimal amount,
    String description,
    String status,
    LocalDateTime timestamp
) {}
