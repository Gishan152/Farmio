package com.springcloud.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDTO {
    private Long id;
    private Long wasteListingId;
    private Long requesterId;
    private Long agentId;

    private BigDecimal quantity;
    private String unit;
    private BigDecimal pricePerUnit;
    private BigDecimal grossAmount;

    private String status;
    private String paymentMethod;
    private String transactionRef;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
