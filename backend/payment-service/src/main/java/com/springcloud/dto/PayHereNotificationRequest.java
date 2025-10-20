package com.springcloud.dto;

import java.math.BigDecimal;

public record PayHereNotificationRequest(
    String merchantId,
    String orderId,
    String paymentId,
    BigDecimal payhereAmount,
    String payhereCurrency,
    String statusCode,
    String md5sig,
    String custom1,
    String custom2,
    String method,
    String statusMessage,
    String cardHolderName,
    String cardNo,
    String cardExpiry
) {}
