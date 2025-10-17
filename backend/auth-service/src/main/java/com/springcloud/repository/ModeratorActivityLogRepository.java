package com.springcloud.repository;

import com.springcloud.model.ModeratorActivityLog;
import com.springcloud.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ModeratorActivityLogRepository extends JpaRepository<ModeratorActivityLog, Long> {
    
    /**
     * Find all activity logs for a specific moderator
     */
    List<ModeratorActivityLog> findByModeratorOrderByTimestampDesc(User moderator);
    
    /**
     * Find all activity logs for a specific moderator within a time range
     */
    List<ModeratorActivityLog> findByModeratorAndTimestampBetweenOrderByTimestampDesc(
            User moderator, LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * Find all activity logs for a specific action type
     */
    List<ModeratorActivityLog> findByActionOrderByTimestampDesc(String action);
    
    /**
     * Count activities by moderator grouped by action
     */
    @Query("SELECT m.action, COUNT(m) FROM ModeratorActivityLog m WHERE m.moderator = ?1 GROUP BY m.action")
    List<Object[]> countActivitiesByAction(User moderator);
}
