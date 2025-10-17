package com.springcloud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "transporter_routes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private long id;

    private String to;
    private String from;

    @ElementCollection
    @CollectionTable(name="route_days", joinColumns = @JoinColumn(name = "route_id"))
    private List<String> days;

    private String frequency;
    private LocalTime timeFrom;
    private LocalTime timeTo;
    private Boolean allowDetours;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
    private long providerId;
}
