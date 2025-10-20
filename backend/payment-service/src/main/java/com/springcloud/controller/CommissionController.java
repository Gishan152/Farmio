package com.springcloud.controller;

import com.springcloud.dto.CommissionDetailsResponse;
import com.springcloud.dto.CommissionSummaryResponse;
import com.springcloud.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/commissions")
@CrossOrigin(origins = "*")
public class CommissionController {
    
    @Autowired
    private PaymentService paymentService;
    
    /**
     * Get overall commission summary
     */
    @GetMapping("/summary")
    public ResponseEntity<CommissionSummaryResponse> getCommissionSummary() {
        try {
            CommissionSummaryResponse summary = paymentService.getCommissionSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get commission details for a specific payment reference
     */
    @GetMapping("/payment/{paymentReference}")
    public ResponseEntity<CommissionDetailsResponse> getCommissionByPaymentReference(
            @PathVariable String paymentReference) {
        try {
            CommissionDetailsResponse commission = paymentService.getCommissionByPaymentReference(paymentReference);
            return ResponseEntity.ok(commission);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get commission history within a date range
     */
    @GetMapping("/history")
    public ResponseEntity<List<CommissionDetailsResponse>> getCommissionHistory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<CommissionDetailsResponse> history = paymentService.getCommissionHistory(startDate, endDate);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get commission statistics for a specific date range
     */
    @GetMapping("/statistics")
    public ResponseEntity<CommissionSummaryResponse> getCommissionStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            CommissionSummaryResponse statistics = paymentService.getCommissionStatistics(startDate, endDate);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get recent commission transactions (last 7 days)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<CommissionDetailsResponse>> getRecentCommissions() {
        try {
            LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
            LocalDateTime now = LocalDateTime.now();
            List<CommissionDetailsResponse> recentCommissions = paymentService.getCommissionHistory(sevenDaysAgo, now);
            return ResponseEntity.ok(recentCommissions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get commission statistics for current month
     */
    @GetMapping("/current-month")
    public ResponseEntity<CommissionSummaryResponse> getCurrentMonthCommissions() {
        try {
            LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime now = LocalDateTime.now();
            CommissionSummaryResponse monthlyStats = paymentService.getCommissionStatistics(startOfMonth, now);
            return ResponseEntity.ok(monthlyStats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get commission statistics for current year
     */
    @GetMapping("/current-year")
    public ResponseEntity<CommissionSummaryResponse> getCurrentYearCommissions() {
        try {
            LocalDateTime startOfYear = LocalDateTime.now().withDayOfYear(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime now = LocalDateTime.now();
            CommissionSummaryResponse yearlyStats = paymentService.getCommissionStatistics(startOfYear, now);
            return ResponseEntity.ok(yearlyStats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}