package com.springcloud.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {

    private Long vehicleId;
    private Long providerId;
    private String regNo;
    private String type;
    private String kind;
    private String maxLoad;
    private String frontPhoto;
    private String sidePhoto;
    private String updatedAt;
}