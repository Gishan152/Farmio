package com.springcloud.service;

import com.springcloud.dto.ActivityLogDTO;
import com.springcloud.model.ModeratorActivityLog;
import com.springcloud.model.User;
import com.springcloud.repository.ModeratorActivityLogRepository;
import com.springcloud.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModeratorActivityService {

    private final ModeratorActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Log a new moderator activity
     */
    @Transactional
    public void logActivity(Long moderatorId, String action, String details) {
        User moderator = userRepository.findById(moderatorId)
                .orElseThrow(() -> new UsernameNotFoundException("Moderator not found with ID: " + moderatorId));
        
        // Verify this is a moderator
        boolean isModerator = moderator.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_MODERATOR"));
        
        if (!isModerator) {
            throw new RuntimeException("User is not a moderator. Cannot log activity.");
        }
        
        ModeratorActivityLog log = ModeratorActivityLog.builder()
                .moderator(moderator)
                .timestamp(LocalDateTime.now())
                .action(action)
                .details(details)
                .build();
        
        activityLogRepository.save(log);
    }
    
    /**
     * Get all activity logs for a specific moderator
     */
    public List<ActivityLogDTO> getActivityLogsForModerator(Long moderatorId) {
        User moderator = userRepository.findById(moderatorId)
                .orElseThrow(() -> new UsernameNotFoundException("Moderator not found with ID: " + moderatorId));
        
        List<ModeratorActivityLog> activityLogs = activityLogRepository.findByModeratorOrderByTimestampDesc(moderator);
        
        return mapToDTO(activityLogs);
    }
    
    /**
     * Get activity logs for a moderator within a specific time period
     */
    public List<ActivityLogDTO> getActivityLogsForModeratorInPeriod(
            Long moderatorId, LocalDateTime startTime, LocalDateTime endTime) {
        User moderator = userRepository.findById(moderatorId)
                .orElseThrow(() -> new UsernameNotFoundException("Moderator not found with ID: " + moderatorId));
        
        List<ModeratorActivityLog> activityLogs = activityLogRepository.findByModeratorAndTimestampBetweenOrderByTimestampDesc(
                moderator, startTime, endTime);
        
        return mapToDTO(activityLogs);
    }
    
    /**
     * Helper method to map activity logs to DTOs
     */
    private List<ActivityLogDTO> mapToDTO(List<ModeratorActivityLog> activityLogs) {
        return activityLogs.stream()
                .map(log -> new ActivityLogDTO(
                        log.getId(),
                        log.getTimestamp().format(DATE_FORMATTER),
                        log.getAction(),
                        log.getDetails()
                ))
                .collect(Collectors.toList());
    }
}
