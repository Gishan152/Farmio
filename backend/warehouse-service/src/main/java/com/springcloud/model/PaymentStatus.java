package com.springcloud.model;

public enum PaymentStatus {
    NOT_REQUIRED,         // For rejected bookings
    PENDING,              // Payment required but not initiated
    PROCESSING,           // Payment in progress (PayHere)
    PAID,                 // Payment confirmed by PayHere
    AWAITING_APPROVAL,    // Payment confirmed, awaiting warehouse owner approval
    APPROVED,             // Warehouse owner approved payment
    HELD_IN_ESCROW,       // Funds held in escrow
    RELEASED,             // Funds released to owner
    REFUNDED,             // Partial/full refund processed
    FAILED                // Payment failed
}