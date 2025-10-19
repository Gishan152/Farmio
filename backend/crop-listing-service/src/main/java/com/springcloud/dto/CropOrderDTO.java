package com.springcloud.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO that matches the CropInfo structure in order-service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CropOrderDTO {
    private Long id;
    private String type;
    private BigDecimal pricePerUnit;
    private String farm;
    private Integer availableStock;
    private Long farmerId;
    private String location;
    private double rating;
    private boolean verified;
    private String imageUrl;
    private String unitMeasurement;
    private boolean transportationAvailable;
    private boolean returnsAccepted;
    private List<String> badges;
}
