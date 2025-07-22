package com.springcloud.dto;

import java.time.LocalDate;

public class FarmerBidDto {
    private Long buyerRequestId;
    private Double biddingPrice;
    private String location;
    private LocalDate deadline;
    private String notes;
    private String bidStatus;
    
    public String getBidStatus() { return bidStatus; }
    public void setBidStatus(String bidStatus) { this.bidStatus = bidStatus; }

    public Long getBuyerRequestId() { return buyerRequestId; }
    public void setBuyerRequestId(Long buyerRequestId) { this.buyerRequestId = buyerRequestId; }

    public Double getBiddingPrice() { return biddingPrice; }
    public void setBiddingPrice(Double biddingPrice) { this.biddingPrice = biddingPrice; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
