package com.springcloud.dto;

import java.time.LocalDate;

public class FarmerBidResponseDto {
    private Long id;
    private Double biddingPrice;
    private String location;
    private LocalDate deadline;
    private String notes;
    private String bidStatus;
    private LocalDate createdDate;

    // BuyerRequest fields
    private Long buyerRequestId;
    private String crop;
    private Long buyerUserId;
    private String unitMeasurement;
    private double quantity;
    private String quality;
    private double priceMin;
    private double priceMax;
    private String buyerLocation;
    private LocalDate buyerDeadline;
    private String buyerNotes;
    private String visibility;
    private LocalDate date;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getBiddingPrice() { return biddingPrice; }
    public void setBiddingPrice(Double biddingPrice) { this.biddingPrice = biddingPrice; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getBidStatus() { return bidStatus; }
    public void setBidStatus(String bidStatus) { this.bidStatus = bidStatus; }
    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }
    public Long getBuyerRequestId() { return buyerRequestId; }
    public void setBuyerRequestId(Long buyerRequestId) { this.buyerRequestId = buyerRequestId; }
    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }
    public Long getBuyerUserId() { return buyerUserId; }
    public void setBuyerUserId(Long buyerUserId) { this.buyerUserId = buyerUserId; }
    public String getUnitMeasurement() { return unitMeasurement; }
    public void setUnitMeasurement(String unitMeasurement) { this.unitMeasurement = unitMeasurement; }
    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }
    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }
    public double getPriceMin() { return priceMin; }
    public void setPriceMin(double priceMin) { this.priceMin = priceMin; }
    public double getPriceMax() { return priceMax; }
    public void setPriceMax(double priceMax) { this.priceMax = priceMax; }
    public String getBuyerLocation() { return buyerLocation; }
    public void setBuyerLocation(String buyerLocation) { this.buyerLocation = buyerLocation; }
    public LocalDate getBuyerDeadline() { return buyerDeadline; }
    public void setBuyerDeadline(LocalDate buyerDeadline) { this.buyerDeadline = buyerDeadline; }
    public String getBuyerNotes() { return buyerNotes; }
    public void setBuyerNotes(String buyerNotes) { this.buyerNotes = buyerNotes; }
    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
