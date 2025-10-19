package com.springcloud.dto;

import com.springcloud.model.Product;
import java.time.LocalDateTime;
import java.util.List;

public class ProductResponseDTO {
    // All fields from the original Product entity
    private Long id;
    private Long userId;
    private String productName;
    private String measurement;
    private Double pricePerUnit;
    private Integer availableStock;
    private String location;
    private String transportAvailability;
    private String returnAccepted;
    private List<String> badges;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // New fields for rating
    private double averageRating;
    private int ratingCount;

    // Constructor to easily map from Product entity
    public ProductResponseDTO(Product product) {
        this.id = product.getId();
        this.userId = product.getUserId();
        this.productName = product.getProductName();
        this.measurement = product.getMeasurement();
        this.pricePerUnit = product.getPricePerUnit();
        this.availableStock = product.getAvailableStock();
        this.location = product.getLocation();
        this.transportAvailability = product.getTransportAvailability();
        this.returnAccepted = product.getReturnAccepted();
        this.badges = product.getBadges();
        this.imageUrls = product.getImageUrls();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
    }

    // Getters and Setters for all fields...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getMeasurement() { return measurement; }
    public void setMeasurement(String measurement) { this.measurement = measurement; }
    public Double getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(Double pricePerUnit) { this.pricePerUnit = pricePerUnit; }
    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getTransportAvailability() { return transportAvailability; }
    public void setTransportAvailability(String transportAvailability) { this.transportAvailability = transportAvailability; }
    public String getReturnAccepted() { return returnAccepted; }
    public void setReturnAccepted(String returnAccepted) { this.returnAccepted = returnAccepted; }
    public List<String> getBadges() { return badges; }
    public void setBadges(List<String> badges) { this.badges = badges; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }
    public int getRatingCount() { return ratingCount; }
    public void setRatingCount(int ratingCount) { this.ratingCount = ratingCount; }
}