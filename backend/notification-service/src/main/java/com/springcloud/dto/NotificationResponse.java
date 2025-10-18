package com.springcloud.dto;

import com.springcloud.entity.NotificationPriority;
import com.springcloud.entity.NotificationStatus;
import com.springcloud.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    
    private Long id;
    private String userId;
    private String title;
    private String message;
    private NotificationType type;
    private NotificationStatus status;
    private NotificationPriority priority;
    
    // Delivery channels
    private Boolean sendEmail;
    private Boolean sendWebsocket;
    private Boolean sendSms;
    
    // Metadata
    private String category;
    private String actionUrl;
    private String imageUrl;
    private Map<String, Object> metadata;
    
    // Related entities
    private String relatedEntityType;
    private String relatedEntityId;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
    private LocalDateTime expiresAt;
    
    // Delivery status
    private Boolean emailSent;
    private LocalDateTime emailSentAt;
    private String emailError;
    private Boolean websocketSent;
    private LocalDateTime websocketSentAt;
    
    // Retry information
    private Integer retryCount;
    private Integer maxRetries;
    private LocalDateTime nextRetryAt;
    
    // Computed fields
    private Boolean isRead;
    private Boolean isExpired;
    private Boolean canRetry;
}