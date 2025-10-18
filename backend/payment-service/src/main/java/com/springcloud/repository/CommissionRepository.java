package com.springcloud.repository;

import com.springcloud.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {
    
    Optional<Commission> findByPaymentReference(String paymentReference);
    
    List<Commission> findByPaymentId(Long paymentId);
    
    List<Commission> findByPayerIdOrderByCreatedAtDesc(Long payerId);
    
    List<Commission> findByPayeeIdOrderByCreatedAtDesc(Long payeeId);
    
    List<Commission> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(c.commissionAmount) FROM Commission c")
    BigDecimal getTotalCommissionAmount();
    
    @Query("SELECT SUM(c.commissionAmount) FROM Commission c WHERE c.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal getTotalCommissionAmountBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                                   @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(c) FROM Commission c")
    Long getTotalCommissionCount();
    
    @Query("SELECT c FROM Commission c WHERE c.createdAt >= :date ORDER BY c.createdAt DESC")
    List<Commission> findRecentCommissions(@Param("date") LocalDateTime date);
    
    @Query("SELECT SUM(c.originalAmount) FROM Commission c")
    BigDecimal getTotalProcessedAmount();
    
    @Query("SELECT AVG(c.commissionRate) FROM Commission c")
    BigDecimal getAverageCommissionRate();
}