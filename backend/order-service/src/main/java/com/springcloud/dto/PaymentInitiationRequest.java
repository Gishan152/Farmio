package com.springcloud.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PaymentInitiationRequest {
    private String reference; // Add Order ID as the reference
    private Double amount;
    private Long payerId;
    private Long payeeId;
    private String paymentType = "ORDER";
    private Double escrowPercentage;
    private String description;
}
