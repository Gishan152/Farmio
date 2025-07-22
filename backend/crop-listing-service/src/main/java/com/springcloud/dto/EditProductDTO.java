package com.springcloud.dto;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class EditProductDTO {
    private String productName;
    private double price;
    private String measurement;
    private int stock;
    private String transport;
    private String returnAccepted;
    private String address;
    private List<String> badges;
    private List<String> existingImages;
    private MultipartFile[] newImages;

    // Getters and setters
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getMeasurement() { return measurement; }
    public void setMeasurement(String measurement) { this.measurement = measurement; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public String getTransport() { return transport; }
    public void setTransport(String transport) { this.transport = transport; }
    public String getReturnAccepted() { return returnAccepted; }
    public void setReturnAccepted(String returnAccepted) { this.returnAccepted = returnAccepted; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public List<String> getBadges() { return badges; }
    public void setBadges(List<String> badges) { this.badges = badges; }
    public List<String> getExistingImages() { return existingImages; }
    public void setExistingImages(List<String> existingImages) { this.existingImages = existingImages; }
    public MultipartFile[] getNewImages() { return newImages; }
    public void setNewImages(MultipartFile[] newImages) { this.newImages = newImages; }
}