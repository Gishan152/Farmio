package com.springcloud.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "waste_agents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WasteAgent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String state;
    
    @Column(name = "postal_code")
    private String postalCode;
    
    @Column(name = "license_number", unique = true)
    private String licenseNumber;
    
    @Column(name = "company_name")
    private String companyName;
    
    @Column(name = "specialization")
    private String specialization; // e.g., "organic", "electronic", "hazardous", "general"
    
    @Column(name = "service_radius")
    private Double serviceRadius; // in kilometers
    
    @Column(name = "rating")
    private Double rating;
    
    @Column(name = "total_reviews")
    private Integer totalReviews;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "is_verified")
    private Boolean isVerified;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
        if (isVerified == null) {
            isVerified = false;
        }
        if (totalReviews == null) {
            totalReviews = 0;
        }
        if (rating == null) {
            rating = 0.0;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}