package com.springcloud.dto;

public record EscrowRefundRequest(
    String reference,
    Long payeeId,
    Long payerId
) {}
