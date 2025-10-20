package com.springcloud.controller;

import com.springcloud.dto.NotificationRequest;
import com.springcloud.dto.NotificationResponse;
import com.springcloud.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Slf4j
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Create a new notification
     */
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody NotificationRequest request) {
        log.info("Creating notification for user: {}, type: {}", request.getUserId(), request.getType());
        NotificationResponse response = notificationService.createNotification(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get user notifications with pagination
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<NotificationResponse>> getUserNotifications(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Getting notifications for user: {}, page: {}, size: {}", userId, page, size);
        Page<NotificationResponse> notifications = notificationService.getUserNotifications(userId, page, size);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Get unread notifications for user
     */
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<Page<NotificationResponse>> getUnreadNotifications(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Getting unread notifications for user: {}, page: {}, size: {}", userId, page, size);
        Page<NotificationResponse> notifications = notificationService.getUnreadNotifications(userId, page, size);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Get unread notification count
     */
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable String userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
    
    /**
     * Mark notification as read
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long notificationId,
            @RequestHeader("X-User-Id") String userId) {
        log.info("Marking notification {} as read for user: {}", notificationId, userId);
        NotificationResponse response = notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Mark all notifications as read for user
     */
    @PutMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<Map<String, String>> markAllAsRead(@PathVariable String userId) {
        log.info("Marking all notifications as read for user: {}", userId);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
    
    /**
     * Delete notification
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable Long notificationId,
            @RequestHeader("X-User-Id") String userId) {
        log.info("Deleting notification {} for user: {}", notificationId, userId);
        notificationService.deleteNotification(notificationId, userId);
        return ResponseEntity.ok(Map.of("message", "Notification deleted successfully"));
    }
}