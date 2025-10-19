package com.springcloud.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationSchedulerService {
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Process pending notification retries every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void processPendingRetries() {
        log.debug("Processing pending notification retries...");
        notificationService.processPendingRetries();
    }
    
    /**
     * Clean up expired notifications every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void cleanupExpiredNotifications() {
        log.debug("Cleaning up expired notifications...");
        notificationService.cleanupExpiredNotifications();
    }
    
    /**
     * Log notification statistics every 30 minutes
     */
    @Scheduled(fixedRate = 1800000) // 30 minutes
    public void logStatistics() {
        // This could be enhanced to provide detailed statistics
        log.info("Notification service is running healthy");
    }
}