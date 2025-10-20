package com.springcloud.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentConfirmedMessage(
        String reference,
        BigDecimal amount,
        String paymentId,
        String status,
        LocalDateTime timestamp,
        Long payerId,
        Long payeeId
) {}
