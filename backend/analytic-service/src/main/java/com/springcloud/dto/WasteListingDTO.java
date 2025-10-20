package com.springcloud.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WasteListingDTO {
    private Long id;
    private String wasteType;
    private String description;
    private RequesterDTO requester;
    private BigDecimal quantity;
    private String unit;
    private String timeSlot;
    private BigDecimal pricePerUnit;
    private BigDecimal totalPrice;
    private LocalDate availableFrom;
    private LocalDate expiresOn;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long acceptedBy;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequesterDTO {
        private Long id;
        private String name;
        private String role;
        private Double rating;
        private String location;
        private String accountNumber;
    }
}