package com.springcloud.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who made the request (farmer/warehouse owner)
    private String requesterName;
    private String requesterLocation;
    private BigDecimal farmRating;
    private String requesterAvatar; // optional URL

    // Waste details
    private String wasteType;
    private String quantity;
    private String preferredPickupTime;

    // Offer
    private BigDecimal offeredPrice;
    private BigDecimal totalOffer;

    // Status: Pending / Accepted / Rejected
    private String status;

    private LocalDate requestDate;

    // --- getters & setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getRequesterLocation() { return requesterLocation; }
    public void setRequesterLocation(String requesterLocation) { this.requesterLocation = requesterLocation; }

    public BigDecimal getFarmRating() { return farmRating; }
    public void setFarmRating(BigDecimal farmRating) { this.farmRating = farmRating; }

    public String getRequesterAvatar() { return requesterAvatar; }
    public void setRequesterAvatar(String requesterAvatar) { this.requesterAvatar = requesterAvatar; }

    public String getWasteType() { return wasteType; }
    public void setWasteType(String wasteType) { this.wasteType = wasteType; }

    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }

    public String getPreferredPickupTime() { return preferredPickupTime; }
    public void setPreferredPickupTime(String preferredPickupTime) { this.preferredPickupTime = preferredPickupTime; }

    public BigDecimal getOfferedPrice() { return offeredPrice; }
    public void setOfferedPrice(BigDecimal offeredPrice) { this.offeredPrice = offeredPrice; }

    public BigDecimal getTotalOffer() { return totalOffer; }
    public void setTotalOffer(BigDecimal totalOffer) { this.totalOffer = totalOffer; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDate requestDate) { this.requestDate = requestDate; }
}