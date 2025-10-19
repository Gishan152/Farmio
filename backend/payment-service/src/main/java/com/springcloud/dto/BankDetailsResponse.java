package com.springcloud.dto;

public record BankDetailsResponse(
    Long userId,
    String bank,
    String branch,
    String accountNumber,
    String accountHolderName,
    String swiftCode,
    String status
) {}
