package com.springcloud.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.springcloud.common.enums.OrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "\"buyer_request\"") // escape reserved word
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String crop;
    @Column(nullable = false)
    private Long userId; // The buyer who created the request
    private String unitMeasurement;
    private double quantity;
    private String quality;
    private double priceMin;
    private double priceMax;
    private String location;
    private LocalDate deadline;
    private String notes;
    private String visibility;
    private LocalDate date;

    @OneToMany(mappedBy = "buyerRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.List<FarmerBid> bids;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
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
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
