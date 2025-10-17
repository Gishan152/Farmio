package com.springcloud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "transport_availability")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
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
