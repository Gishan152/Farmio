package com.springcloud.dto;

import java.time.LocalDate;

public class RouteDTO {
    private Long id;
    private String startingLocation;
    private String destination;
    private Double distance;
    private Integer estimatedTime; // in minutes
    private LocalDate routeDate;

    // Constructors
    public RouteDTO() {
    }

    public RouteDTO(Long id, String startingLocation, String destination, Double distance, Integer estimatedTime, LocalDate routeDate) {
        this.id = id;
        this.startingLocation = startingLocation;
        this.destination = destination;
        this.distance = distance;
        this.estimatedTime = estimatedTime;
        this.routeDate = routeDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStartingLocation() {
        return startingLocation;
    }

    public void setStartingLocation(String startingLocation) {
        this.startingLocation = startingLocation;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public LocalDate getRouteDate() {
        return routeDate;
    }

    public void setRouteDate(LocalDate routeDate) {
        this.routeDate = routeDate;
    }
}

