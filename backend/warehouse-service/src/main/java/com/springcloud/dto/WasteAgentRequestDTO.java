package com.springcloud.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WasteAgentRequestDTO {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Phone number should be valid")
    private String phoneNumber;
    
    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address must be less than 255 characters")
    private String address;
    
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must be less than 100 characters")
    private String city;
    
    @NotBlank(message = "State is required")
    @Size(max = 50, message = "State must be less than 50 characters")
    private String state;
    
    @Pattern(regexp = "^[0-9]{5,10}$", message = "Postal code should be valid")
    private String postalCode;
    
    @Size(max = 50, message = "License number must be less than 50 characters")
    private String licenseNumber;
    
    @Size(max = 100, message = "Company name must be less than 100 characters")
    private String companyName;
    
    @Size(max = 50, message = "Specialization must be less than 50 characters")
    private String specialization;
    
    @DecimalMin(value = "0.0", message = "Service radius must be positive")
    @DecimalMax(value = "1000.0", message = "Service radius must be less than 1000km")
    private Double serviceRadius;
    
    private Boolean isActive = true;
    
    private Boolean isVerified = false;
}