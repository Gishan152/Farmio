package com.springcloud.dto;

import com.springcloud.model.FacilityStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FacilityRequestDTO {
    
    @NotBlank(message = "Facility name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;
    
    @NotBlank(message = "Facility type is required")
    private String type;
    
    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;
    
    @NotBlank(message = "State is required")
    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;
    
    @NotBlank(message = "Country is required")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;
    
    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;
    
    // Optional geographic coordinates - will be auto-populated via Google Maps if not provided
    private Double latitude;
    
    private Double longitude;
    
    // Will be auto-populated from Google Maps API
    private String formattedAddress;
    
    @NotBlank(message = "Contact person is required")
    @Size(max = 255, message = "Contact person must not exceed 255 characters")
    private String contactPerson;
    
    @NotBlank(message = "Contact phone is required")
    @Size(max = 20, message = "Contact phone must not exceed 20 characters")
    private String contactPhone;
    
    @NotBlank(message = "Contact email is required")
    @Email(message = "Please provide a valid email")
    private String contactEmail;
    
    @NotNull(message = "Total capacity is required")
    @DecimalMin(value = "0.1", message = "Total capacity must be at least 0.1")
    private Double totalCapacity;
    
    @NotNull(message = "Available capacity is required")
    @DecimalMin(value = "0.0", message = "Available capacity must be at least 0.0")
    private Double availableCapacity;
    
    private String temperatureRange;
    
    private String humidityRange;
    
    @NotNull(message = "Status is required")
    private FacilityStatus status;
    
    private String operatingHours;
    
    private String facilityFeatures;
    
    private String certifications;
} 