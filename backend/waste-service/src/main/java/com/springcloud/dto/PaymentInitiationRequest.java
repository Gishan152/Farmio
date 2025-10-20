package com.springcloud.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PaymentInitiationRequest {
    private String reference; // e.g., waste payment id or listing id
    private Double amount;
    private Long payerId;   // who pays (waste agent)
    private Long payeeId;   // who receives (farmer/requester)
    private String paymentType; // e.g., WASTE
    private Double escrowPercentage; // 100.0 for waste per requirement
    private String description;
}
