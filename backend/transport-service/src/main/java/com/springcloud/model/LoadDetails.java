package com.springcloud.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "load_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoadDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String loadId;

    private String fromLocation;
    private String toLocation;
    private Double weight;
    private Double payment;
    private String product;
    private LocalDateTime pickupTime;
    private LocalDateTime estimatedDelivery;
    private String status;
    private Long driverId;
    private Double driverRating;

}
