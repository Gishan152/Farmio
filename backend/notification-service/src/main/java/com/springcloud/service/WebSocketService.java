package com.springcloud.service;

import com.springcloud.dto.WebSocketMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class WebSocketService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    // Track active user sessions
    private final Map<String, Set<String>> userSessions = new ConcurrentHashMap<>();
    
    /**
     * Send notification to specific user via WebSocket
     */
    public boolean sendToUser(String userId, WebSocketMessage message) {
        try {
            if (message.getTimestamp() == null) {
                message.setTimestamp(LocalDateTime.now());
            }
            
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications",
                message
            );
            
            log.info("WebSocket message sent to user: {}, type: {}", userId, message.getType());
            return true;
        } catch (Exception e) {
            log.error("Failed to send WebSocket message to user: {}", userId, e);
            return false;
        }
    }
    
    /**
     * Send notification to specific user with simple parameters
     */
    public boolean sendNotificationToUser(String userId, String title, String message) {
        WebSocketMessage wsMessage = WebSocketMessage.notification(userId, title, message);
        return sendToUser(userId, wsMessage);
    }
    
    /**
     * Broadcast message to all connected users
     */
    public boolean broadcast(WebSocketMessage message) {
        try {
            if (message.getTimestamp() == null) {
                message.setTimestamp(LocalDateTime.now());
            }
            
            messagingTemplate.convertAndSend("/topic/notifications", message);
            log.info("WebSocket message broadcasted to all users, type: {}", message.getType());
            return true;
        } catch (Exception e) {
            log.error("Failed to broadcast WebSocket message", e);
            return false;
        }
    }
    
    /**
     * Send system announcement to all users
     */
    public boolean broadcastSystemMessage(String message) {
        WebSocketMessage wsMessage = WebSocketMessage.system(message);
        return broadcast(wsMessage);
    }
    
    /**
     * Send message to users in specific category/role
     */
    public boolean sendToTopic(String topic, WebSocketMessage message) {
        try {
            if (message.getTimestamp() == null) {
                message.setTimestamp(LocalDateTime.now());
            }
            
            messagingTemplate.convertAndSend("/topic/" + topic, message);
            log.info("WebSocket message sent to topic: {}, type: {}", topic, message.getType());
            return true;
        } catch (Exception e) {
            log.error("Failed to send WebSocket message to topic: {}", topic, e);
            return false;
        }
    }
    
    /**
     * Check if user is currently online (has active WebSocket sessions)
     */
    public boolean isUserOnline(String userId) {
        Set<String> sessions = userSessions.get(userId);
        return sessions != null && !sessions.isEmpty();
    }
    
    /**
     * Track user session when they connect
     */
    public void addUserSession(String userId, String sessionId) {
        userSessions.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(sessionId);
        log.debug("User session added - UserId: {}, SessionId: {}", userId, sessionId);
    }
    
    /**
     * Remove user session when they disconnect
     */
    public void removeUserSession(String userId, String sessionId) {
        Set<String> sessions = userSessions.get(userId);
        if (sessions != null) {
            sessions.remove(sessionId);
            if (sessions.isEmpty()) {
                userSessions.remove(userId);
            }
            log.debug("User session removed - UserId: {}, SessionId: {}", userId, sessionId);
        }
    }
    
    /**
     * Get count of active user sessions
     */
    public int getActiveUserCount() {
        return userSessions.size();
    }
    
    /**
     * Get count of total active sessions
     */
    public int getActiveSessionCount() {
        return userSessions.values().stream()
                .mapToInt(Set::size)
                .sum();
    }
}