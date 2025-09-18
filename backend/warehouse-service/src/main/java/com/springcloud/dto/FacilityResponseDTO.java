package com.springcloud.dto;

import com.springcloud.model.FacilityStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FacilityResponseDTO {
    private Long id;
    private String name;
    private String type;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private Double latitude;
    private Double longitude;
    private String formattedAddress;
    private String contactPerson;
    private String contactPhone;
    private String contactEmail;
    private Double totalCapacity;
    private Double availableCapacity;
    private String temperatureRange;
    private String humidityRange;
    private FacilityStatus status;
    private String operatingHours;
    private String facilityFeatures;
    private String certifications;
    private Long ownerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 