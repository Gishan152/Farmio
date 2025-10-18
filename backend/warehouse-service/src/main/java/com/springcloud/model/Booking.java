package com.springcloud.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "bookings")
@Data @NoArgsConstructor @AllArgsConstructor
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long warehouseId;
    private Long farmerId;        // user who booked
    private Long ownerId;         // warehouse owner
    private String status;        // PENDING / APPROVED / REJECTED / RETRIEVAL_REQUESTED
    private Double quantityKg;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime requestedRetrievalAt; // early retrieval
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist void pre(){ createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate void onUpdate(){ updatedAt = LocalDateTime.now(); }
}