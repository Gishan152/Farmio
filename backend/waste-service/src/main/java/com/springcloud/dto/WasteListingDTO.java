package com.springcloud.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WasteListingDTO {
    private Long id;
    private String wasteType;
    private String description;
    private BigDecimal quantity;
    private String unit;
    private String timeSlot;
    private BigDecimal pricePerUnit;
    private BigDecimal totalPrice;
    private LocalDate availableFrom;
    private LocalDate expiresOn;
    private String status;


    // Flattened requester info
    private String requesterName;
    private String requesterLocation;
    private Double requesterRating;

    private Long acceptedBy;

    // Explicit accessors for MapStruct
    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }
    public String getRequesterLocation() { return requesterLocation; }
    public void setRequesterLocation(String requesterLocation) { this.requesterLocation = requesterLocation; }
    public Double getRequesterRating() { return requesterRating; }
    public void setRequesterRating(Double requesterRating) { this.requesterRating = requesterRating; }
}
