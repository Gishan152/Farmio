package com.springcloud.repository;

import com.springcloud.entity.Notification;
import com.springcloud.entity.NotificationStatus;
import com.springcloud.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Find notifications by user
    Page<Notification> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    // Find unread notifications by user
    Page<Notification> findByUserIdAndReadAtIsNullOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    // Find notifications by status
    List<Notification> findByStatus(NotificationStatus status);
    
    // Find notifications by type and user
    List<Notification> findByUserIdAndType(String userId, NotificationType type);
    
    // Find pending notifications for retry
    @Query("SELECT n FROM Notification n WHERE n.status = :status AND n.retryCount < n.maxRetries AND n.nextRetryAt <= :now")
    List<Notification> findPendingRetries(@Param("status") NotificationStatus status, @Param("now") LocalDateTime now);
    
    // Find expired notifications
    @Query("SELECT n FROM Notification n WHERE n.expiresAt <= :now AND n.status != 'EXPIRED'")
    List<Notification> findExpiredNotifications(@Param("now") LocalDateTime now);
    
    // Count unread notifications by user
    long countByUserIdAndReadAtIsNull(String userId);
    
    // Find notifications by related entity
    List<Notification> findByRelatedEntityTypeAndRelatedEntityId(String entityType, String entityId);
    
    // Find notifications created between dates
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.createdAt BETWEEN :startDate AND :endDate ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdAndCreatedAtBetween(@Param("userId") String userId, 
                                                       @Param("startDate") LocalDateTime startDate, 
                                                       @Param("endDate") LocalDateTime endDate);
    
    // Find notifications by category
    List<Notification> findByUserIdAndCategory(String userId, String category);
    
    // Delete old notifications (cleanup)
    void deleteByCreatedAtBefore(LocalDateTime cutoffDate);
    
    // Statistics queries
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.status = :status")
    long countByUserIdAndStatus(@Param("userId") String userId, @Param("status") NotificationStatus status);
    
    @Query("SELECT n.type, COUNT(n) FROM Notification n WHERE n.userId = :userId GROUP BY n.type")
    List<Object[]> getNotificationStatsByUser(@Param("userId") String userId);
}