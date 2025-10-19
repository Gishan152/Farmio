package com.springcloud.dto;

import com.springcloud.model.StorageType;
import com.springcloud.model.WarehouseStatus;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseResponseDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private StorageType storageType;
    private Integer temperatureMin;
    private Integer temperatureMax;

    /* ===== SLOT DETAILS ===== */
    private Integer totalSlots;
    private Integer capacityPerSlot;
    private Integer totalCapacity;
    
    /* ===== CAPACITY INFO ===== */
    private Integer totalCapacityKg;
    private Integer usedCapacityKg;
    private Integer availableCapacityKg;
    private Double availableCapacityPercentage;

    private Double pricePerKg;
    private Double pricePerTonn; // Frontend expects this
    private String certifications;
    private WarehouseStatus status;
    private String keeperName;
    private String keeperContact;
    private String keeperEmail;
    private Long ownerId;
    
    // Location fields
    private Double latitude;
    private Double longitude;
    private Double distanceKm; // For nearby search results
    
    // Frontend specific fields
    private Boolean verified;
    private String owner; // Owner name for display
    private Double rating; // Warehouse rating
    private List<String> badges; // Certifications as badges
    private String imageUrl; // Warehouse image
    private String description; // Warehouse description
    private Integer slots; // Available slots count
    private Double capacityTons; // Capacity in tons for frontend
    
    // Owner information
    private OwnerInfo ownerInfo;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OwnerInfo {
        private String name;
        private String avatarUrl;
        private Double rating;
        private String email;
        private String phone;
    }
}