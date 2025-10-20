package com.springcloud.dto;

import com.springcloud.entity.NotificationPriority;
import com.springcloud.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    @NotNull(message = "Notification type is required")
    private NotificationType type;
    
    private NotificationPriority priority = NotificationPriority.MEDIUM;
    
    // Delivery channels
    private Boolean sendEmail = false;
    private Boolean sendWebsocket = true;
    private Boolean sendSms = false;
    
    // Metadata
    private String category;
    private String actionUrl;
    private String imageUrl;
    
    // Additional data as key-value pairs
    private Map<String, Object> metadata;
    
    // Related entities
    private String relatedEntityType;
    private String relatedEntityId;
    
    // Email specific
    private String emailTemplate;
    
    // Scheduling
    private LocalDateTime scheduleAt; // For future delivery
    private LocalDateTime expiresAt;
    
    // Retry configuration
    private Integer maxRetries = 3;
}