package com.springcloud.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BulkSlotCreationDTO {
    
    @NotNull(message = "Warehouse ID is required")
    @Min(value = 1, message = "Warehouse ID must be positive")
    private Long warehouseId;
    
    @NotNull(message = "Number of slots is required")
    @Min(value = 1, message = "Number of slots must be at least 1")
    @Max(value = 1000, message = "Cannot create more than 1000 slots at once")
    private Integer numberOfSlots;
    
    @NotBlank(message = "Slot number prefix is required")
    @Size(max = 10, message = "Slot number prefix must not exceed 10 characters")
    private String slotNumberPrefix;
    
    @NotNull(message = "Capacity per slot is required")
    @Min(value = 1, message = "Capacity per slot must be at least 1 kg")
    @Max(value = 100000, message = "Capacity per slot must not exceed 100,000 kg")
    private Integer capacityPerSlot;
    
    @Min(value = 1, message = "Starting number must be at least 1")
    private Integer startingNumber = 1;
}