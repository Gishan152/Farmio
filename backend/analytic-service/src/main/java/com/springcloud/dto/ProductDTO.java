package com.springcloud.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private Long userId;
    private String productName;
    private String measurement;
    private BigDecimal pricePerUnit;
    private Integer availableStock;
    private String location;
    private String transportAvailability;
    private String returnAccepted;
    private List<String> badges = new ArrayList<>();
    private List<String> imageUrls = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
