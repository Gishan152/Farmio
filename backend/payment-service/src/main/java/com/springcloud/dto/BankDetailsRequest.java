package com.springcloud.dto;

public record BankDetailsRequest(
    Long userId,
    String bank,
    String branch,
    String accountNumber,
    String accountHolderName,
    String swiftCode
) {}
