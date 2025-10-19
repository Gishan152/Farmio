package com.springcloud.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InvoiceResponse(
    String invoiceId,
    Long userId,
    BigDecimal amount,
    String description,
    String reference,
    String status,
    LocalDateTime createdAt,
    LocalDateTime dueDate
) {}
