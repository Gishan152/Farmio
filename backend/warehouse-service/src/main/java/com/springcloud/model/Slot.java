package com.springcloud.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "slot_number", nullable = false)
    private String slotNumber;
    
    @Column(name = "warehouse_id", nullable = false)
    private Long warehouseId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", insertable = false, updatable = false)
    private Warehouse warehouse;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status;
    
    @Column(name = "capacity_kg", nullable = false)
    private Integer capacityKg;
    
    @Column(name = "current_load_kg")
    private Integer currentLoadKg = 0;
    
    @Column(name = "reserved_load_kg")
    private Integer reservedLoadKg = 0;
    
    @Column(name = "product_type")
    private String productType;
    
    @Column(name = "reserved_by_user_id")
    private Long reservedByUserId;
    
    @Column(name = "reserved_until")
    private LocalDateTime reservedUntil;
    
    @Column(name = "last_cleaned")
    private LocalDateTime lastCleaned;
    
    @Column(name = "temperature")
    private Double temperature;
    
    @Column(name = "humidity")
    private Double humidity;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentLoadKg == null) {
            currentLoadKg = 0;
        }
        if (reservedLoadKg == null) {
            reservedLoadKg = 0;
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public Integer getAvailableCapacity() {
        return capacityKg - currentLoadKg - reservedLoadKg;
    }
    
    public Double getUtilizationPercentage() {
        if (capacityKg == 0) return 0.0;
        return ((double) (currentLoadKg + reservedLoadKg) / capacityKg) * 100;
    }
    
    public boolean isAvailable() {
        return status == SlotStatus.AVAILABLE && getAvailableCapacity() > 0;
    }
    
    public boolean isReserved() {
        return status == SlotStatus.RESERVED && 
               reservedUntil != null && 
               reservedUntil.isAfter(LocalDateTime.now());
    }
}