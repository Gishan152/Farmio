package com.springcloud.dto;

import com.springcloud.model.SlotStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SlotRequestDTO {
    
    @NotBlank(message = "Slot number is required")
    @Size(max = 20, message = "Slot number must not exceed 20 characters")
    private String slotNumber;
    
    @NotNull(message = "Warehouse ID is required")
    @Min(value = 1, message = "Warehouse ID must be positive")
    private Long warehouseId;
    
    @NotNull(message = "Slot status is required")
    private SlotStatus status;
    
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1 kg")
    @Max(value = 100000, message = "Capacity must not exceed 100,000 kg")
    private Integer capacityKg;
    
    @Min(value = 0, message = "Current load cannot be negative")
    private Integer currentLoadKg = 0;
    
    @Min(value = 0, message = "Reserved load cannot be negative")
    private Integer reservedLoadKg = 0;
    
    @Size(max = 100, message = "Product type must not exceed 100 characters")
    private String productType;
    
    @Min(value = 1, message = "User ID must be positive")
    private Long reservedByUserId;
    
    private LocalDateTime reservedUntil;
    
    private LocalDateTime lastCleaned;
    
    @DecimalMin(value = "-50.0", message = "Temperature must be at least -50°C")
    @DecimalMax(value = "50.0", message = "Temperature must not exceed 50°C")
    private Double temperature;
    
    @DecimalMin(value = "0.0", message = "Humidity cannot be negative")
    @DecimalMax(value = "100.0", message = "Humidity cannot exceed 100%")
    private Double humidity;
    
    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}