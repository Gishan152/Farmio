package com.springcloud.common.enums;

public enum PaymentStatus {
    PENDING, // Initial status when payment is created
    COMPLETED, // Payment has been successfully completed
    FAILED, // Payment failed due to an error
    CANCELLED, // Payment was cancelled by the user or system
    REFUNDED, // Payment has been refunded to the payer
    ESCROWED, // Specified percentage of the payment is held in escrow
    RELEASED, // Escrowed payment has been released to the payee
    DISPUTED
}
