package com.springcloud.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "facilities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String type; // WAREHOUSE, COLD_STORAGE, DRY_STORAGE, PROCESSING_CENTER
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String state;
    
    @Column(nullable = false)
    private String country;
    
    @Column(name = "postal_code")
    private String postalCode;
    
    // Geographic coordinates for precise location
    @Column(name = "latitude")
    private Double latitude;
    
    @Column(name = "longitude")
    private Double longitude;
    
    @Column(name = "formatted_address")
    private String formattedAddress; // Full formatted address from Google Maps
    
    @Column(name = "contact_person")
    private String contactPerson;
    
    @Column(name = "contact_phone")
    private String contactPhone;
    
    @Column(name = "contact_email")
    private String contactEmail;
    
    @Column(name = "total_capacity")
    private Double totalCapacity; // in metric tons
    
    @Column(name = "available_capacity")
    private Double availableCapacity;
    
    @Column(name = "temperature_range")
    private String temperatureRange;
    
    @Column(name = "humidity_range")
    private String humidityRange;
    
    @Enumerated(EnumType.STRING)
    private FacilityStatus status;
    
    @Column(name = "operating_hours")
    private String operatingHours;
    
    @Column(name = "facility_features")
    private String facilityFeatures; // JSON string of features
    
    @Column(name = "certifications")
    private String certifications;
    
    @Column(name = "owner_id")
    private Long ownerId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 