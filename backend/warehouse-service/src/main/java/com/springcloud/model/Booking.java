package com.springcloud.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "bookings")
@Data @NoArgsConstructor @AllArgsConstructor
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic booking info
    private Long warehouseId;
    private Long farmerId;        // user who booked
    private Long ownerId;         // warehouse owner
    
    // Status tracking
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.NOT_REQUIRED;
    
    // Booking details
    private Double quantityKg;
    private Integer durationDays;
    private String productType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    // Slot assignment (created after approval)
    private Long assignedSlotId;  // Links to created slot
    private String slotNumber;    // For quick reference
    
    // Payment details
    private String paymentId;     // From payment service
    private String payHereTransactionId;
    private BigDecimal baseCost;
    private BigDecimal bufferCost;
    private BigDecimal platformFee;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    
    // Additional fields
    private LocalDateTime requestedRetrievalAt; // early retrieval
    private String rejectionReason;
    private String notes;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime paymentInitiatedAt;
    private LocalDateTime paymentConfirmedAt;
    private LocalDateTime storageStartedAt;

    @PrePersist 
    void pre(){ 
        createdAt = updatedAt = LocalDateTime.now(); 
        if (status == null) status = BookingStatus.PENDING;
        if (paymentStatus == null) paymentStatus = PaymentStatus.NOT_REQUIRED;
    }
    
    @PreUpdate 
    void onUpdate(){ 
        updatedAt = LocalDateTime.now(); 
    }
}