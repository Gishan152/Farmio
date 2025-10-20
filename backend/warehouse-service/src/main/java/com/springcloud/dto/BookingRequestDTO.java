package com.springcloud.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {
    private Long warehouseId;
    private Double quantityKg;
    private Integer durationDays;
    private String productType;
    private String notes;
    private String farmerName;
    private String farmerPhone;
    private String farmerEmail;
}