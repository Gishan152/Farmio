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
    private Double weight;
    private Double payment;
    private String produce;
    private LocalDateTime pickupTime;
    private LocalDateTime estimatedDelivery;
    private String status;

}
