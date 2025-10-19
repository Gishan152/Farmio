package com.springcloud.dto;

import com.springcloud.model.StorageType;
import com.springcloud.model.WarehouseStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class WarehouseRequestDTO {

    @NotBlank(message = "Warehouse name is required")
    @Size(max = 255)
    private String name;

    @NotBlank(message = "Address is required")
    @Size(max = 500)
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    private String city;

    @NotNull(message = "Storage type is required")
    private StorageType storageType;

    @NotNull(message = "Min temperature is required")
    private Integer temperatureMin;

    @NotNull(message = "Max temperature is required")
    private Integer temperatureMax;

    /* ===== SLOT DETAILS ===== */
    @NotNull(message = "Total slots required")
    @Min(value = 1, message = "At least 1 slot")
    private Integer totalSlots;

    @NotNull(message = "Capacity per slot required")
    @Min(value = 1, message = "At least 1 kg")
    private Integer capacityPerSlot;

    private Integer totalCapacity; // computed by service

    @NotNull(message = "Price per kg required")
    @DecimalMin(value = "0.01")
    private Double pricePerKg;

    @Size(max = 1000)
    private String certifications;

    @NotNull(message = "Status required")
    private WarehouseStatus status;

    @NotBlank(message = "Keeper name required")
    @Size(max = 255)
    private String keeperName;

    @NotBlank(message = "Keeper contact required")
    @Size(max = 20)
    private String keeperContact;

    @Email
    @NotBlank(message = "Keeper email required")
    private String keeperEmail;
    
    // Location coordinates (optional, can be populated from Google Maps)
    private Double latitude;
    private Double longitude;
}