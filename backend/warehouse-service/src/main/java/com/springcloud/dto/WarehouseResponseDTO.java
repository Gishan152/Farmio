package com.springcloud.dto;

import com.springcloud.model.StorageType;
import com.springcloud.model.WarehouseStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
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

    private Double pricePerKg;
    private String certifications;
    private WarehouseStatus status;
    private String keeperName;
    private String keeperContact;
    private String keeperEmail;
    private Long ownerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}