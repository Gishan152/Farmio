package com.springcloud.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private BigDecimal amount;
    private BigDecimal escrowPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long payeeId; // The farmer/seller who receives payment
    private Long payerId; // The buyer/customer who makes payment
    private String description;
    
    // Additional fields from order data or other sources
    private String status;
    private Long orderId;
    private String productCategory;
    private String paymentMethod;
    
    // Derived fields for analytics
    private String formattedDate;
    private String dayOfWeek;
    private String month;
    private Integer year;
}