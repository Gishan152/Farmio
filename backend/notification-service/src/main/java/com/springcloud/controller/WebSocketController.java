package com.springcloud.controller;

import com.springcloud.dto.WebSocketMessage;
import com.springcloud.service.WebSocketService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@Controller
@Slf4j
public class WebSocketController {
    
    @Autowired
    private WebSocketService webSocketService;
    
    /**
     * Handle client connection subscription to their personal queue
     */
    @SubscribeMapping("/user/queue/notifications")
    public void subscribeToPersonalNotifications(Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        String userId = principal != null ? principal.getName() : "anonymous";
        String sessionId = headerAccessor.getSessionId();
        
        log.info("User {} subscribed to personal notifications, session: {}", userId, sessionId);
        webSocketService.addUserSession(userId, sessionId);
    }
    
    /**
     * Handle client subscription to public notifications
     */
    @SubscribeMapping("/topic/notifications")
    public void subscribeToPublicNotifications(Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        String userId = principal != null ? principal.getName() : "anonymous";
        log.info("User {} subscribed to public notifications", userId);
    }
    
    /**
     * Handle incoming messages from clients (echo back for testing)
     */
    @MessageMapping("/send")
    @SendTo("/topic/notifications")
    public WebSocketMessage handleMessage(@Payload WebSocketMessage message, Principal principal) {
        String userId = principal != null ? principal.getName() : "anonymous";
        log.info("Received message from user {}: {}", userId, message.getMessage());
        
        message.setUserId(userId);
        return message;
    }
    
    /**
     * Handle ping/heartbeat from clients
     */
    @MessageMapping("/ping")
    public void handlePing(Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        String userId = principal != null ? principal.getName() : "anonymous";
        String sessionId = headerAccessor.getSessionId();
        
        log.debug("Ping received from user: {}, session: {}", userId, sessionId);
        
        // Send pong back
        WebSocketMessage pong = new WebSocketMessage();
        pong.setType("pong");
        pong.setMessage("pong");
        webSocketService.sendToUser(userId, pong);
    }
}

/**
 * REST Controller for WebSocket statistics and management
 */
@RestController
@RequestMapping("/api/websocket")
@Slf4j
class WebSocketManagementController {
    
    @Autowired
    private WebSocketService webSocketService;
    
    /**
     * Get WebSocket statistics
     */
    @GetMapping("/stats")
    public Map<String, Object> getWebSocketStats() {
        return Map.of(
            "activeUsers", webSocketService.getActiveUserCount(),
            "activeSessions", webSocketService.getActiveSessionCount()
        );
    }
    
    /**
     * Check if user is online
     */
    @GetMapping("/user/{userId}/online")
    public Map<String, Boolean> isUserOnline(String userId) {
        return Map.of("online", webSocketService.isUserOnline(userId));
    }
}