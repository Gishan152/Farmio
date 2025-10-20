package com.springcloud.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationUpdateDTO {
    
    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;
    
    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;
    
    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;
    
    private String address;
    private String city;
    
    // Constructor without warehouseId for single warehouse updates
    public LocationUpdateDTO(Double latitude, Double longitude, String address, String city) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.city = city;
    }
}