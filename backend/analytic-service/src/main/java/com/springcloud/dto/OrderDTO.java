package com.springcloud.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long orderId;
    private String paymentId;
    private BigDecimal total;
    private Long farmerId;
    private Long buyerId;
    private String status;
    private String transport;
    private List<OrderItemDTO> items;
}
