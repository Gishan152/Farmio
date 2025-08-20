package com.springcloud.dto;

public record EscrowReleaseRequest(
    String reference,
    Long payeeId
) {}
