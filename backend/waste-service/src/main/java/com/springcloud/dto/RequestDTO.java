package com.springcloud.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RequestDTO {
    private Long id;

    @NotBlank(message = "Requester name is required")
    private String requesterName;

    @NotBlank(message = "Requester location is required")
    private String requesterLocation;

    @DecimalMin(value = "0.0", inclusive = false, message = "Farm rating must be positive")
    @DecimalMax(value = "5.0", message = "Farm rating cannot exceed 5")
    private BigDecimal farmRating;

    private String requesterAvatar;

    // optional notes/description
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotBlank(message = "Waste type is required")
    private String wasteType;

    @NotBlank(message = "Quantity is required")
    private String quantity;

    private String preferredPickupTime;

    @NotNull(message = "Offered price is required")
    @Positive(message = "Offered price must be greater than 0")
    private BigDecimal offeredPrice;

    @NotNull(message = "Total offer is required")
    @Positive(message = "Total offer must be greater than 0")
    private BigDecimal totalOffer;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Request date is required")
    private LocalDate requestDate;

    private Long acceptedByAgentId;
    private String acceptedByAgentName;

    // constructor
    public RequestDTO(Long id, String requesterName, String requesterLocation, BigDecimal farmRating,
                      String requesterAvatar, String wasteType, String quantity,
                      String preferredPickupTime,
                      BigDecimal offeredPrice, BigDecimal totalOffer,
                      String status, LocalDate requestDate, Long acceptedByAgentId, String acceptedByAgentName) {
        this.id = id;
        this.requesterName = requesterName;
        this.requesterLocation = requesterLocation;
        this.farmRating = farmRating;
        this.requesterAvatar = requesterAvatar;
        this.wasteType = wasteType;
        this.description = description;
        this.quantity = quantity;
        this.preferredPickupTime = preferredPickupTime;
        this.offeredPrice = offeredPrice;
        this.totalOffer = totalOffer;
        this.status = status;
        this.requestDate = requestDate;
        this.acceptedByAgentId = acceptedByAgentId;
        this.acceptedByAgentName = acceptedByAgentName;
    }

    // getters
    public Long getId() { return id; }
    public String getRequesterName() { return requesterName; }
    public String getRequesterLocation() { return requesterLocation; }
    public BigDecimal getFarmRating() { return farmRating; }
    public String getRequesterAvatar() { return requesterAvatar; }
    public String getWasteType() { return wasteType; }
    public String getQuantity() { return quantity; }
    public String getPreferredPickupTime() { return preferredPickupTime; }
    public String getDescription() { return description; }
    public BigDecimal getOfferedPrice() { return offeredPrice; }
    public BigDecimal getTotalOffer() { return totalOffer; }
    public String getStatus() { return status; }
    public LocalDate getRequestDate() { return requestDate; }
    public Long getAcceptedByAgentId() { return acceptedByAgentId; }
    public String getAcceptedByAgentName() { return acceptedByAgentName; }
}