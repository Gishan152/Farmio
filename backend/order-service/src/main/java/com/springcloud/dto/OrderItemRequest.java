package com.springcloud.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class OrderItemRequest {
    private Long cropId;
    private BigDecimal pricePerUnit;
    private String unitMeasurement;
    private BigDecimal quantity;
}
