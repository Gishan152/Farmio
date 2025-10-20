package com.springcloud.model;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicleId;
    private Long providerId;
    private String regNo;
    private String type;
    private String kind;
    private String maxLoad;
    private String frontPhoto;
    private String sidePhoto;
    private LocalDateTime updatedAt;
}