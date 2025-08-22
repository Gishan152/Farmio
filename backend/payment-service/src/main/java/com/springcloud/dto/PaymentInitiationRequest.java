package com.springcloud.dto;

import java.math.BigDecimal;

public record PaymentInitiationRequest(
    String reference,
    BigDecimal amount,
    Long payerId,
    Long payeeId,
    String paymentType,
    BigDecimal escrowPercentage,
    String description
) {}
