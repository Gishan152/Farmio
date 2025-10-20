package com.springcloud.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SlotReservationDTO {
    
    @NotNull(message = "Capacity to reserve is required")
    @Min(value = 1, message = "Capacity to reserve must be at least 1 kg")
    private Integer capacityToReserve;
    
    @NotNull(message = "Reserved until date is required")
    @Future(message = "Reserved until date must be in the future")
    private LocalDateTime reservedUntil;
    
    @Size(max = 100, message = "Product type must not exceed 100 characters")
    private String productType;
    
    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}