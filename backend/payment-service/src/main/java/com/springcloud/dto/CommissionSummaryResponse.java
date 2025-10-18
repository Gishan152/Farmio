package com.springcloud.dto;

import java.math.BigDecimal;
import java.util.List;

public record CommissionSummaryResponse(
    BigDecimal totalCommissionAmount,
    BigDecimal totalProcessedAmount,
    Long totalTransactionCount,
    BigDecimal averageCommissionRate,
    List<CommissionDetailsResponse> recentCommissions
) {}