package com.springcloud.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInitiationDTO {
    private String paymentId;
    private String paymentUrl;
    private BigDecimal totalAmount;
    private String bookingId;
    private String message;
}