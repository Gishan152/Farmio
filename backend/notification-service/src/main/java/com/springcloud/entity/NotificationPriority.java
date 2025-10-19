package com.springcloud.entity;

public enum NotificationPriority {
    LOW,     // Can be delayed, batched
    MEDIUM,  // Normal processing
    HIGH,    // Process quickly
    URGENT   // Process immediately
}