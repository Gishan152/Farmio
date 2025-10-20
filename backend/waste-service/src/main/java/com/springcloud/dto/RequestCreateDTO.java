package com.springcloud.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * DTO used for creating a new Request via API.
 * Does not require status or requestDate (they are set by the backend).
 */
public class RequestCreateDTO {

    // requesterName is resolved by backend through auth-service; optional here
    private String requesterName;

    @NotBlank(message = "Requester location is required")
    private String requesterLocation;

    @DecimalMin(value = "0.0", inclusive = false, message = "Farm rating must be positive")
    @DecimalMax(value = "5.0", message = "Farm rating cannot exceed 5")
    private BigDecimal farmRating;

    private String requesterAvatar;

    @NotBlank(message = "Waste type is required")
    private String wasteType;

    @NotBlank(message = "Quantity is required")
    private String quantity;

    private String preferredPickupTime;

    private String description;

    @NotNull(message = "Offered price is required")
    @Positive(message = "Offered price must be greater than 0")
    private BigDecimal offeredPrice;

    @NotNull(message = "Total offer is required")
    @Positive(message = "Total offer must be greater than 0")
    private BigDecimal totalOffer;

    public RequestCreateDTO() {}

    // getters and setters
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
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getOfferedPrice() { return offeredPrice; }
    public void setOfferedPrice(BigDecimal offeredPrice) { this.offeredPrice = offeredPrice; }
    public BigDecimal getTotalOffer() { return totalOffer; }
    public void setTotalOffer(BigDecimal totalOffer) { this.totalOffer = totalOffer; }
}
