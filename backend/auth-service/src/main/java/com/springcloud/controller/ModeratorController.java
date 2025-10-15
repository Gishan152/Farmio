package com.springcloud.controller;

import com.springcloud.dto.*;
import com.springcloud.service.ModeratorActivityService;
import com.springcloud.service.ModeratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ModeratorController {

    private final ModeratorService moderatorService;
    private final ModeratorActivityService activityService;

    /**
     * Endpoint for admin to create a new moderator account with temporary password
     */
    @PostMapping("/admin/moderators")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ModeratorResponse> createModerator(@RequestBody ModeratorCreateRequest request) {
        return ResponseEntity.ok(moderatorService.createModerator(request));
    }

    /**
     * Endpoint for admin to get all moderators
     */
    @GetMapping("/admin/moderators")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ModeratorDTO>> getAllModerators() {
        return ResponseEntity.ok(moderatorService.getAllModerators());
    }
    
    /**
     * Endpoint for analytics service to get moderator DTOs
     * This endpoint doesn't require auth to make it accessible for analytics service
     */
    @GetMapping("/admin/moderators/all-dto")
    public ResponseEntity<List<ModeratorDTO>> getAllModeratorsDTO() {
        return ResponseEntity.ok(moderatorService.getAllModerators());
    }

    /**
     * Endpoint for admin to update a moderator
     */
    @PutMapping("/admin/moderators/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ModeratorResponse> updateModerator(
            @PathVariable Long id,
            @RequestBody ModeratorUpdateRequest request) {
        return ResponseEntity.ok(moderatorService.updateModerator(id, request));
    }

    /**
     * Endpoint for admin to delete a moderator
     */
    @DeleteMapping("/admin/moderators/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteModerator(@PathVariable Long id) {
        moderatorService.deleteModerator(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint for admin to reset a moderator's password
     */
    @PostMapping("/admin/moderators/{id}/reset-password")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PasswordResetResponse> resetModeratorPassword(@PathVariable Long id) {
        return ResponseEntity.ok(moderatorService.resetModeratorPassword(id));
    }

    /**
     * Endpoint for moderator to change their temporary password
     */
    @PostMapping("/moderator/change-temp-password")
    public ResponseEntity<AuthResponse> changeTemporaryPassword(@RequestBody PasswordChangeRequest request) {
        return ResponseEntity.ok(moderatorService.changeTemporaryPassword(request));
    }
    
    /**
     * Endpoint for moderator login
     */
    @PostMapping("/moderator/login")
    public ResponseEntity<ModeratorLoginResponse> moderatorLogin(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(moderatorService.moderatorLogin(request));
    }
    
    /**
     * Endpoint to get activity logs for a moderator
     */
    @GetMapping("/admin/moderators/{id}/activity")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ActivityLogDTO>> getModeratorActivityLogs(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getActivityLogsForModerator(id));
    }
    
    /**
     * Endpoint to get activity logs for a moderator within a time range
     */
    @GetMapping("/admin/moderators/{id}/activity/range")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ActivityLogDTO>> getModeratorActivityLogsByDateRange(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(activityService.getActivityLogsForModeratorInPeriod(id, from, to));
    }
}
