package com.springcloud.entity;

public enum NotificationStatus {
    PENDING,    // Created but not yet sent
    SENT,       // Successfully sent via all requested channels
    DELIVERED,  // Confirmed delivered (e.g., email opened, WebSocket received)
    FAILED,     // Failed to send
    EXPIRED,    // Expired before sending
    CANCELLED   // Manually cancelled
}