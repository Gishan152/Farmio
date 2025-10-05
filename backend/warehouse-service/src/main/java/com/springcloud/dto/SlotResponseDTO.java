package com.springcloud.dto;

import com.springcloud.model.SlotStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SlotResponseDTO {
    private Long id;
    private String slotNumber;
    private Long warehouseId;
    private String warehouseName;
    private SlotStatus status;
    private Integer capacityKg;
    private Integer currentLoadKg;
    private Integer reservedLoadKg;
    private Integer availableCapacity;
    private Double utilizationPercentage;
    private String productType;
    private Long reservedByUserId;
    private String reservedByUserName;
    private LocalDateTime reservedUntil;
    private LocalDateTime lastCleaned;
    private Double temperature;
    private Double humidity;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isAvailable;
    private boolean isReserved;
}