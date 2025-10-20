package com.springcloud.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class RouteDto {
    private Long id;
    private String to;
    private String from;
    private List<String> days;
    private String frequency;
    private LocalTime timeFrom;
    private LocalTime timeTo;
    private Boolean allowDetours;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
    private Long providerId;
}
