package com.springcloud.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AvailabilityDto {
    private Long id;
    private Boolean available;
    private Boolean allowDetours;
    private String currentLocation;
    private String availableFrom;
    private String availableTo;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
    private Long providerId;
}
