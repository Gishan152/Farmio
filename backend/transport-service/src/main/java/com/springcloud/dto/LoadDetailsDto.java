package com.springcloud.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoadDetailsDto {
    private Long id;
    private String loadId;
    private String fromLocation;
    private String toLocation;
    private String from;
    private String to;
    private Double weight;
    private Double payment;
    private String product;
    private LocalDateTime pickupTime;
    private LocalDateTime estimatedDelivery;
    private String driverStatus;
    private String buyerStatus;
    private String sellerStatus;
    private Long driverId;

}
