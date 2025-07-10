package com.springcloud.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
class OrderItem {
    private Long cropId;
    private BigDecimal pricePerUnit;
    private String unitMeasurement;
    private BigDecimal quantity;
}

public record CreateOrderRequest (
    List<OrderItem> items
){ }