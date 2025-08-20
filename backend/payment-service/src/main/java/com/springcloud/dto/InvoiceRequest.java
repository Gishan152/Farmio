package com.springcloud.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InvoiceRequest(
    Long userId,
    BigDecimal amount,
    String description,
    String reference,
    LocalDateTime dueDate
) {}
