package com.springcloud.listener;

import com.springcloud.service.WebSocketService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
public class WebSocketEventListener {
    
    @Autowired
    private WebSocketService webSocketService;
    
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String userId = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : "anonymous";
        
        log.info("WebSocket connection established - SessionId: {}, UserId: {}", sessionId, userId);
        
        if (!"anonymous".equals(userId)) {
            webSocketService.addUserSession(userId, sessionId);
        }
    }
    
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String userId = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : "anonymous";
        
        log.info("WebSocket connection closed - SessionId: {}, UserId: {}", sessionId, userId);
        
        if (!"anonymous".equals(userId)) {
            webSocketService.removeUserSession(userId, sessionId);
        }
    }
}