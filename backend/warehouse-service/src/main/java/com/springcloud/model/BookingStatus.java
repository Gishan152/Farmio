package com.springcloud.model;

public enum BookingStatus {
    PENDING,              // Initial request submitted
    APPROVED,             // Owner approved, slot created, awaiting payment
    PAYMENT_PENDING,      // Payment initiated by customer
    PAYMENT_CONFIRMED,    // Payment confirmed by PayHere, awaiting owner approval
    CONFIRMED,            // Owner approved payment, booking confirmed
    ACTIVE,               // Storage period active
    RETRIEVAL_REQUESTED,  // Early retrieval requested
    APPROVED_FOR_RETRIEVAL, // Early retrieval approved
    RETRIEVAL_REJECTED,   // Early retrieval rejected
    COMPLETED,            // Storage completed normally
    REJECTED,             // Owner rejected initial request
    CANCELLED,            // Cancelled by customer
    EXPIRED               // Payment timeout
}