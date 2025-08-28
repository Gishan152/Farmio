package com.springcloud.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String city;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "storage_type")
    private StorageType storageType;
    
    @Column(name = "temperature_min")
    private Integer temperatureMin;
    
    @Column(name = "temperature_max")
    private Integer temperatureMax;
    
    @Column(name = "total_slots")
    private Integer totalSlots;
    
    @Column(name = "capacity_per_slot")
    private Integer capacityPerSlot;
    
    @Column(name = "total_capacity")
    private Integer totalCapacity;
    
    @Column(name = "price_per_kg")
    private Double pricePerKg;
    
    private String certifications;
    
    @Enumerated(EnumType.STRING)
    private WarehouseStatus status;
    
    @Column(name = "keeper_name")
    private String keeperName;
    
    @Column(name = "keeper_contact")
    private String keeperContact;
    
    @Column(name = "keeper_email")
    private String keeperEmail;
    
    @Column(name = "owner_id")
    private Long ownerId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
