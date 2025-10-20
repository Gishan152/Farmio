package com.springcloud.dto;

import lombok.Data;

/**
 * DTO for advanced warehouse search requests coming from frontend
 */
@Data
public class WarehouseSearchRequestDTO {
    private String search;
    private String city;
    private String storageType;
    private Double minCapacity;
    private Double maxPrice;
    private Boolean verifiedOnly = false;

    // Optional location for nearby searches
    private Double latitude;
    private Double longitude;
    private Integer radiusKm;

    // Pagination and sorting
    private Integer page = 0;
    private Integer size = 20;
    private String sortBy = "distance"; // default
    private String sortOrder = "asc";
}
