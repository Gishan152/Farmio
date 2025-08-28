package com.springcloud.dto;

import com.springcloud.model.StorageType;
import com.springcloud.model.WarehouseStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class WarehouseRequestDTO {
    
    @NotBlank(message = "Warehouse name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;
    
    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;
    
    @NotNull(message = "Storage type is required")
    private StorageType storageType;
    
    @NotNull(message = "Minimum temperature is required")
    private Integer temperatureMin;
    
    @NotNull(message = "Maximum temperature is required")
    private Integer temperatureMax;
    
    @NotNull(message = "Total slots is required")
    @Min(value = 1, message = "Total slots must be at least 1")
    private Integer totalSlots;
    
    @NotNull(message = "Capacity per slot is required")
    @Min(value = 1, message = "Capacity per slot must be at least 1")
    private Integer capacityPerSlot;
    
    @NotNull(message = "Total capacity is required")
    @Min(value = 1, message = "Total capacity must be at least 1")
    private Integer totalCapacity;
    
    @NotNull(message = "Price per kg is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private Double pricePerKg;
    
    @Size(max = 1000, message = "Certifications must not exceed 1000 characters")
    private String certifications;
    
    @NotNull(message = "Status is required")
    private WarehouseStatus status;
    
    @NotBlank(message = "Keeper name is required")
    @Size(max = 255, message = "Keeper name must not exceed 255 characters")
    private String keeperName;
    
    @NotBlank(message = "Keeper contact is required")
    @Size(max = 20, message = "Keeper contact must not exceed 20 characters")
    private String keeperContact;
    
    @NotBlank(message = "Keeper email is required")
    @Email(message = "Please provide a valid email")
    private String keeperEmail;
}
