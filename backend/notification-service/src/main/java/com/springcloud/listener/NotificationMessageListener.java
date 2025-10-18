package com.springcloud.listener;

import com.springcloud.config.RabbitMQConfig;
import com.springcloud.dto.NotificationRequest;
import com.springcloud.entity.NotificationPriority;
import com.springcloud.entity.NotificationType;
import com.springcloud.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class NotificationMessageListener {
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Listen to order-related notifications
     */
    @RabbitListener(queues = RabbitMQConfig.ORDER_NOTIFICATION_QUEUE)
    public void handleOrderNotification(Map<String, Object> message) {
        try {
            log.info("Received order notification: {}", message);
            
            NotificationRequest request = new NotificationRequest();
            request.setUserId((String) message.get("userId"));
            request.setTitle((String) message.get("title"));
            request.setMessage((String) message.get("message"));
            request.setType(NotificationType.valueOf((String) message.getOrDefault("type", "ORDER_STATUS_UPDATE")));
            request.setPriority(NotificationPriority.valueOf((String) message.getOrDefault("priority", "MEDIUM")));
            request.setSendEmail((Boolean) message.getOrDefault("sendEmail", true));
            request.setSendWebsocket((Boolean) message.getOrDefault("sendWebsocket", true));
            request.setCategory("order");
            request.setActionUrl((String) message.get("actionUrl"));
            request.setRelatedEntityType("ORDER");
            request.setRelatedEntityId((String) message.get("orderId"));
            request.setEmailTemplate((String) message.getOrDefault("emailTemplate", "order-notification"));
            
            notificationService.createNotification(request);
            
        } catch (Exception e) {
            log.error("Failed to process order notification: {}", message, e);
        }
    }
    
    /**
     * Listen to payment-related notifications
     */
    @RabbitListener(queues = RabbitMQConfig.PAYMENT_NOTIFICATION_QUEUE)
    public void handlePaymentNotification(Map<String, Object> message) {
        try {
            log.info("Received payment notification: {}", message);
            
            NotificationRequest request = new NotificationRequest();
            request.setUserId((String) message.get("userId"));
            request.setTitle((String) message.get("title"));
            request.setMessage((String) message.get("message"));
            request.setType(NotificationType.valueOf((String) message.getOrDefault("type", "PAYMENT_RECEIVED")));
            request.setPriority(NotificationPriority.valueOf((String) message.getOrDefault("priority", "HIGH")));
            request.setSendEmail((Boolean) message.getOrDefault("sendEmail", true));
            request.setSendWebsocket((Boolean) message.getOrDefault("sendWebsocket", true));
            request.setCategory("payment");
            request.setActionUrl((String) message.get("actionUrl"));
            request.setRelatedEntityType("PAYMENT");
            request.setRelatedEntityId((String) message.get("paymentId"));
            request.setEmailTemplate((String) message.getOrDefault("emailTemplate", "payment-notification"));
            
            notificationService.createNotification(request);
            
        } catch (Exception e) {
            log.error("Failed to process payment notification: {}", message, e);
        }
    }
    
    /**
     * Listen to transport-related notifications
     */
    @RabbitListener(queues = RabbitMQConfig.TRANSPORT_NOTIFICATION_QUEUE)
    public void handleTransportNotification(Map<String, Object> message) {
        try {
            log.info("Received transport notification: {}", message);
            
            NotificationRequest request = new NotificationRequest();
            request.setUserId((String) message.get("userId"));
            request.setTitle((String) message.get("title"));
            request.setMessage((String) message.get("message"));
            request.setType(NotificationType.valueOf((String) message.getOrDefault("type", "TRANSPORT_ASSIGNED")));
            request.setPriority(NotificationPriority.valueOf((String) message.getOrDefault("priority", "MEDIUM")));
            request.setSendEmail((Boolean) message.getOrDefault("sendEmail", false));
            request.setSendWebsocket((Boolean) message.getOrDefault("sendWebsocket", true));
            request.setCategory("transport");
            request.setActionUrl((String) message.get("actionUrl"));
            request.setRelatedEntityType("TRANSPORT");
            request.setRelatedEntityId((String) message.get("transportJobId"));
            request.setEmailTemplate((String) message.getOrDefault("emailTemplate", "transport-notification"));
            
            notificationService.createNotification(request);
            
        } catch (Exception e) {
            log.error("Failed to process transport notification: {}", message, e);
        }
    }
    
    /**
     * Listen to user-related notifications
     */
    @RabbitListener(queues = RabbitMQConfig.USER_NOTIFICATION_QUEUE)
    public void handleUserNotification(Map<String, Object> message) {
        try {
            log.info("Received user notification: {}", message);
            
            NotificationRequest request = new NotificationRequest();
            request.setUserId((String) message.get("userId"));
            request.setTitle((String) message.get("title"));
            request.setMessage((String) message.get("message"));
            request.setType(NotificationType.valueOf((String) message.getOrDefault("type", "GENERAL_NOTIFICATION")));
            request.setPriority(NotificationPriority.valueOf((String) message.getOrDefault("priority", "MEDIUM")));
            request.setSendEmail((Boolean) message.getOrDefault("sendEmail", true));
            request.setSendWebsocket((Boolean) message.getOrDefault("sendWebsocket", true));
            request.setCategory("user");
            request.setActionUrl((String) message.get("actionUrl"));
            request.setRelatedEntityType("USER");
            request.setRelatedEntityId((String) message.get("userId"));
            request.setEmailTemplate((String) message.getOrDefault("emailTemplate", "user-notification"));
            
            notificationService.createNotification(request);
            
        } catch (Exception e) {
            log.error("Failed to process user notification: {}", message, e);
        }
    }
    
    /**
     * Listen to system-wide notifications
     */
    @RabbitListener(queues = RabbitMQConfig.SYSTEM_NOTIFICATION_QUEUE)
    public void handleSystemNotification(Map<String, Object> message) {
        try {
            log.info("Received system notification: {}", message);
            
            // System notifications can be broadcast to all users or specific users
            String userId = (String) message.get("userId");
            
            if (userId != null) {
                // Send to specific user
                NotificationRequest request = new NotificationRequest();
                request.setUserId(userId);
                request.setTitle((String) message.get("title"));
                request.setMessage((String) message.get("message"));
                request.setType(NotificationType.valueOf((String) message.getOrDefault("type", "SYSTEM_MAINTENANCE")));
                request.setPriority(NotificationPriority.valueOf((String) message.getOrDefault("priority", "HIGH")));
                request.setSendEmail((Boolean) message.getOrDefault("sendEmail", true));
                request.setSendWebsocket((Boolean) message.getOrDefault("sendWebsocket", true));
                request.setCategory("system");
                request.setActionUrl((String) message.get("actionUrl"));
                request.setEmailTemplate((String) message.getOrDefault("emailTemplate", "system-notification"));
                
                notificationService.createNotification(request);
            } else {
                // Broadcast to all users (implement broadcast logic if needed)
                log.info("Broadcasting system notification to all users: {}", message.get("title"));
                // This would require getting all user IDs and creating notifications for each
                // Or using a different broadcast mechanism
            }
            
        } catch (Exception e) {
            log.error("Failed to process system notification: {}", message, e);
        }
    }
}