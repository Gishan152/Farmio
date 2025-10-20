package com.springcloud.service;

import com.springcloud.dto.NotificationRequest;
import com.springcloud.dto.NotificationResponse;
import com.springcloud.dto.WebSocketMessage;
import com.springcloud.entity.Notification;
import com.springcloud.entity.NotificationStatus;
import com.springcloud.entity.NotificationType;
import com.springcloud.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private WebSocketService webSocketService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Create and send a new notification
     */
    public NotificationResponse createNotification(NotificationRequest request) {
        try {
            // Create notification entity
            Notification notification = mapToEntity(request);
            notification = notificationRepository.save(notification);
            
            log.info("Notification created with ID: {} for user: {}", notification.getId(), request.getUserId());
            
            // Send notification asynchronously
            sendNotificationAsync(notification);
            
            return mapToResponse(notification);
        } catch (Exception e) {
            log.error("Failed to create notification for user: {}", request.getUserId(), e);
            throw new RuntimeException("Failed to create notification", e);
        }
    }
    
    /**
     * Send notification through all requested channels
     */
    @Async("notificationTaskExecutor")
    public CompletableFuture<Void> sendNotificationAsync(Notification notification) {
        try {
            boolean allSent = true;
            
            // Send via WebSocket
            if (notification.getSendWebsocket()) {
                boolean wsSuccess = sendWebSocketNotification(notification);
                notification.setWebsocketSent(wsSuccess);
                if (wsSuccess) {
                    notification.setWebsocketSentAt(LocalDateTime.now());
                }
                allSent &= wsSuccess;
            }
            
            // Send via Email
            if (notification.getSendEmail()) {
                boolean emailSuccess = sendEmailNotification(notification);
                notification.setEmailSent(emailSuccess);
                if (emailSuccess) {
                    notification.setEmailSentAt(LocalDateTime.now());
                } else {
                    notification.setEmailError("Failed to send email");
                }
                allSent &= emailSuccess;
            }
            
            // Update notification status
            if (allSent) {
                notification.setStatus(NotificationStatus.SENT);
                notification.setSentAt(LocalDateTime.now());
            } else {
                notification.setStatus(NotificationStatus.FAILED);
                scheduleRetry(notification);
            }
            
            notificationRepository.save(notification);
            
        } catch (Exception e) {
            log.error("Failed to send notification ID: {}", notification.getId(), e);
            notification.setStatus(NotificationStatus.FAILED);
            scheduleRetry(notification);
            notificationRepository.save(notification);
        }
        
        return CompletableFuture.completedFuture(null);
    }
    
    /**
     * Send WebSocket notification
     */
    private boolean sendWebSocketNotification(Notification notification) {
        try {
            WebSocketMessage wsMessage = new WebSocketMessage();
            wsMessage.setType("notification");
            wsMessage.setUserId(notification.getUserId());
            wsMessage.setTitle(notification.getTitle());
            wsMessage.setMessage(notification.getMessage());
            wsMessage.setCategory(notification.getCategory());
            wsMessage.setActionUrl(notification.getActionUrl());
            wsMessage.setImageUrl(notification.getImageUrl());
            wsMessage.setTimestamp(LocalDateTime.now());
            
            // Add additional data
            Map<String, Object> data = new HashMap<>();
            data.put("notificationId", notification.getId());
            data.put("type", notification.getType());
            data.put("priority", notification.getPriority());
            data.put("relatedEntityType", notification.getRelatedEntityType());
            data.put("relatedEntityId", notification.getRelatedEntityId());
            wsMessage.setData(data);
            
            return webSocketService.sendToUser(notification.getUserId(), wsMessage);
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification for ID: {}", notification.getId(), e);
            return false;
        }
    }
    
    /**
     * Send email notification
     */
    private boolean sendEmailNotification(Notification notification) {
        try {
            // Get user email
            String userEmail = userService.getUserEmail(notification.getUserId());
            if (userEmail == null || userEmail.isEmpty()) {
                log.warn("No email found for user: {}", notification.getUserId());
                return false;
            }
            
            // Prepare email variables
            Map<String, Object> variables = new HashMap<>();
            variables.put("userName", userService.getUserName(notification.getUserId()));
            variables.put("notificationTitle", notification.getTitle());
            variables.put("notificationMessage", notification.getMessage());
            variables.put("actionUrl", notification.getActionUrl());
            variables.put("imageUrl", notification.getImageUrl());
            variables.put("category", notification.getCategory());
            
            // Parse metadata if available
            if (notification.getMetadata() != null) {
                // Assuming metadata is stored as JSON string
                // You might want to parse it and add to variables
            }
            
            String template = notification.getEmailTemplate() != null ? 
                            notification.getEmailTemplate() : 
                            getDefaultEmailTemplate(notification.getType());
            
            CompletableFuture<Boolean> result = emailService.sendEmailAsync(
                userEmail, 
                notification.getTitle(), 
                template, 
                variables
            );
            
            return result.get(); // Wait for email to be sent
        } catch (Exception e) {
            log.error("Failed to send email notification for ID: {}", notification.getId(), e);
            return false;
        }
    }
    
    /**
     * Get user notifications with pagination
     */
    public Page<NotificationResponse> getUserNotifications(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return notifications.map(this::mapToResponse);
    }
    
    /**
     * Get unread notifications for user
     */
    public Page<NotificationResponse> getUnreadNotifications(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByUserIdAndReadAtIsNullOrderByCreatedAtDesc(userId, pageable);
        return notifications.map(this::mapToResponse);
    }
    
    /**
     * Mark notification as read
     */
    public NotificationResponse markAsRead(Long notificationId, String userId) {
        Optional<Notification> optNotification = notificationRepository.findById(notificationId);
        if (optNotification.isPresent()) {
            Notification notification = optNotification.get();
            if (notification.getUserId().equals(userId)) {
                notification.setReadAt(LocalDateTime.now());
                notification = notificationRepository.save(notification);
                return mapToResponse(notification);
            }
        }
        throw new RuntimeException("Notification not found or access denied");
    }
    
    /**
     * Mark all notifications as read for user
     */
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadAtIsNullOrderByCreatedAtDesc(userId, Pageable.unpaged()).getContent();
        LocalDateTime now = LocalDateTime.now();
        unreadNotifications.forEach(notification -> notification.setReadAt(now));
        notificationRepository.saveAll(unreadNotifications);
    }
    
    /**
     * Get unread notification count
     */
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadAtIsNull(userId);
    }
    
    /**
     * Delete notification
     */
    public void deleteNotification(Long notificationId, String userId) {
        Optional<Notification> optNotification = notificationRepository.findById(notificationId);
        if (optNotification.isPresent()) {
            Notification notification = optNotification.get();
            if (notification.getUserId().equals(userId)) {
                notificationRepository.delete(notification);
                return;
            }
        }
        throw new RuntimeException("Notification not found or access denied");
    }
    
    /**
     * Schedule notification retry
     */
    private void scheduleRetry(Notification notification) {
        if (notification.canRetry()) {
            notification.setRetryCount(notification.getRetryCount() + 1);
            // Exponential backoff: 5, 25, 125 minutes
            int delayMinutes = (int) Math.pow(5, notification.getRetryCount());
            notification.setNextRetryAt(LocalDateTime.now().plusMinutes(delayMinutes));
            log.info("Scheduled retry #{} for notification ID: {} at {}", 
                    notification.getRetryCount(), notification.getId(), notification.getNextRetryAt());
        }
    }
    
    /**
     * Process pending retries
     */
    @Async("notificationTaskExecutor")
    public void processPendingRetries() {
        List<Notification> pendingRetries = notificationRepository.findPendingRetries(
                NotificationStatus.FAILED, LocalDateTime.now());
        
        log.info("Processing {} pending notification retries", pendingRetries.size());
        
        for (Notification notification : pendingRetries) {
            sendNotificationAsync(notification);
        }
    }
    
    /**
     * Clean up expired notifications
     */
    @Async("notificationTaskExecutor")
    public void cleanupExpiredNotifications() {
        List<Notification> expiredNotifications = notificationRepository.findExpiredNotifications(LocalDateTime.now());
        
        log.info("Marking {} notifications as expired", expiredNotifications.size());
        
        expiredNotifications.forEach(notification -> {
            notification.setStatus(NotificationStatus.EXPIRED);
        });
        
        notificationRepository.saveAll(expiredNotifications);
    }
    
    /**
     * Get default email template for notification type
     */
    private String getDefaultEmailTemplate(NotificationType type) {
        return switch (type) {
            case ORDER_CONFIRMATION, ORDER_STATUS_UPDATE, ORDER_SHIPPED, ORDER_DELIVERED, ORDER_CANCELLED -> "order-notification";
            case PAYMENT_RECEIVED, PAYMENT_FAILED, PAYMENT_REFUNDED, WALLET_UPDATED -> "payment-notification";
            case TRANSPORT_ASSIGNED, TRANSPORT_PICKED_UP, TRANSPORT_IN_TRANSIT, TRANSPORT_DELIVERED, TRANSPORT_DELAYED -> "transport-notification";
            case USER_REGISTRATION, USER_VERIFICATION, PASSWORD_RESET -> "user-notification";
            default -> "general-notification";
        };
    }
    
    /**
     * Map entity to response DTO
     */
    private NotificationResponse mapToResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setUserId(notification.getUserId());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setStatus(notification.getStatus());
        response.setPriority(notification.getPriority());
        response.setSendEmail(notification.getSendEmail());
        response.setSendWebsocket(notification.getSendWebsocket());
        response.setSendSms(notification.getSendSms());
        response.setCategory(notification.getCategory());
        response.setActionUrl(notification.getActionUrl());
        response.setImageUrl(notification.getImageUrl());
        response.setRelatedEntityType(notification.getRelatedEntityType());
        response.setRelatedEntityId(notification.getRelatedEntityId());
        response.setCreatedAt(notification.getCreatedAt());
        response.setSentAt(notification.getSentAt());
        response.setReadAt(notification.getReadAt());
        response.setExpiresAt(notification.getExpiresAt());
        response.setEmailSent(notification.getEmailSent());
        response.setEmailSentAt(notification.getEmailSentAt());
        response.setEmailError(notification.getEmailError());
        response.setWebsocketSent(notification.getWebsocketSent());
        response.setWebsocketSentAt(notification.getWebsocketSentAt());
        response.setRetryCount(notification.getRetryCount());
        response.setMaxRetries(notification.getMaxRetries());
        response.setNextRetryAt(notification.getNextRetryAt());
        response.setIsRead(notification.isRead());
        response.setIsExpired(notification.isExpired());
        response.setCanRetry(notification.canRetry());
        
        // Parse metadata if needed
        // if (notification.getMetadata() != null) {
        //     response.setMetadata(parseMetadata(notification.getMetadata()));
        // }
        
        return response;
    }
    
    /**
     * Map request DTO to entity
     */
    private Notification mapToEntity(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setPriority(request.getPriority());
        notification.setSendEmail(request.getSendEmail());
        notification.setSendWebsocket(request.getSendWebsocket());
        notification.setSendSms(request.getSendSms());
        notification.setCategory(request.getCategory());
        notification.setActionUrl(request.getActionUrl());
        notification.setImageUrl(request.getImageUrl());
        notification.setRelatedEntityType(request.getRelatedEntityType());
        notification.setRelatedEntityId(request.getRelatedEntityId());
        notification.setEmailTemplate(request.getEmailTemplate());
        notification.setExpiresAt(request.getExpiresAt());
        notification.setMaxRetries(request.getMaxRetries());
        
        // Convert metadata map to JSON string if needed
        // if (request.getMetadata() != null) {
        //     notification.setMetadata(convertToJsonString(request.getMetadata()));
        // }
        
        return notification;
    }
}