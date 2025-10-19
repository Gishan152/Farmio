package com.springcloud.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CommissionDetailsResponse(
    Long id,
    String paymentReference,
    Long paymentId,
    BigDecimal originalAmount,
    BigDecimal commissionRate,
    BigDecimal commissionAmount,
    BigDecimal netAmount,
    Long payerId,
    Long payeeId,
    String description,
    LocalDateTime createdAt,
    String createdBy
) {}