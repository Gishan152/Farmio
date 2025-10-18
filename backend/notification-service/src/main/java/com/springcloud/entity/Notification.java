package com.springcloud.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status = NotificationStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationPriority priority = NotificationPriority.MEDIUM;
    
    // Delivery channels
    @Column(name = "send_email")
    private Boolean sendEmail = false;
    
    @Column(name = "send_websocket")
    private Boolean sendWebsocket = true;
    
    @Column(name = "send_sms")
    private Boolean sendSms = false;
    
    // Metadata
    private String category;
    private String actionUrl;
    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON string for additional data
    
    // Related entities
    private String relatedEntityType; // ORDER, PAYMENT, TRANSPORT, etc.
    private String relatedEntityId;
    
    // Timestamps
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    // Email specific
    @Column(name = "email_template")
    private String emailTemplate;
    
    @Column(name = "email_sent")
    private Boolean emailSent = false;
    
    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt;
    
    @Column(name = "email_error")
    private String emailError;
    
    // WebSocket specific
    @Column(name = "websocket_sent")
    private Boolean websocketSent = false;
    
    @Column(name = "websocket_sent_at")
    private LocalDateTime websocketSentAt;
    
    // Retry logic
    @Column(name = "retry_count")
    private Integer retryCount = 0;
    
    @Column(name = "max_retries")
    private Integer maxRetries = 3;
    
    @Column(name = "next_retry_at")
    private LocalDateTime nextRetryAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (expiresAt == null) {
            // Default expiry: 30 days
            expiresAt = createdAt.plusDays(30);
        }
    }
    
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
    
    public boolean isRead() {
        return readAt != null;
    }
    
    public boolean canRetry() {
        return retryCount < maxRetries && !isExpired();
    }
}