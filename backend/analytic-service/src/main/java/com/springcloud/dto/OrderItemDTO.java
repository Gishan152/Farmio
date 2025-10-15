package com.springcloud.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Long cropId;
    private BigDecimal pricePerUnit;
    private String unitMeasurement;
    private BigDecimal quantity;
}
