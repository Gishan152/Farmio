package com.springcloud.dto;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class AddProductDTO {
    private String productName;
    private String measurement;
    private double pricePerUnit;
    private int availableStock;
    private String location;
    private String transportAvailability;
    private String returnAccepted;
    private List<String> badges;
    private MultipartFile[] images;

    // Getters and setters
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getMeasurement() { return measurement; }
    public void setMeasurement(String measurement) { this.measurement = measurement; }
    public double getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(double pricePerUnit) { this.pricePerUnit = pricePerUnit; }
    public int getAvailableStock() { return availableStock; }
    public void setAvailableStock(int availableStock) { this.availableStock = availableStock; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getTransportAvailability() { return transportAvailability; }
    public void setTransportAvailability(String transportAvailability) { this.transportAvailability = transportAvailability; }
    public String getReturnAccepted() { return returnAccepted; }
    public void setReturnAccepted(String returnAccepted) { this.returnAccepted = returnAccepted; }
    public List<String> getBadges() { return badges; }
    public void setBadges(List<String> badges) { this.badges = badges; }
    public MultipartFile[] getImages() { return images; }
    public void setImages(MultipartFile[] images) { this.images = images; }
}