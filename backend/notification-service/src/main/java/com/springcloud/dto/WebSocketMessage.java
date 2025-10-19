package com.springcloud.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    
    private String type; // notification, chat, system, etc.
    private String userId;
    private String title;
    private String message;
    private String category;
    private String actionUrl;
    private String imageUrl;
    private LocalDateTime timestamp;
    private Object data; // Additional payload
    
    public static WebSocketMessage notification(String userId, String title, String message) {
        WebSocketMessage wsMessage = new WebSocketMessage();
        wsMessage.setType("notification");
        wsMessage.setUserId(userId);
        wsMessage.setTitle(title);
        wsMessage.setMessage(message);
        wsMessage.setTimestamp(LocalDateTime.now());
        return wsMessage;
    }
    
    public static WebSocketMessage system(String message) {
        WebSocketMessage wsMessage = new WebSocketMessage();
        wsMessage.setType("system");
        wsMessage.setMessage(message);
        wsMessage.setTimestamp(LocalDateTime.now());
        return wsMessage;
    }
}