package com.springcloud.service;

import com.springcloud.model.BuyerRequest;
import com.springcloud.repository.BuyerRequestRepository;
import com.springcloud.model.FarmerBid;
import com.springcloud.repository.FarmerBidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.springcloud.common.enums.BidStatus;

import com.springcloud.dto.FarmerBidResponseDto;

@Service
public class FarmerBidService {
    @Autowired
    private FarmerBidRepository farmerBidRepository;

    @Autowired
    private BuyerRequestRepository buyerRequestRepository;

    public boolean hasFarmerBidForRequest(Long farmerId, Long buyerRequestId) {
        List<FarmerBid> existing = farmerBidRepository.findByBuyerRequestId(buyerRequestId);
        return existing.stream().anyMatch(b -> b.getFarmerId() != null && b.getFarmerId().equals(farmerId));
    }

    public boolean isBuyerRequestOwner(Long buyerRequestId, String userId) {
        BuyerRequest req = buyerRequestRepository.findById(buyerRequestId).orElse(null);
        if (req == null || req.getUserId() == null) return false;
        return req.getUserId().toString().equals(userId);
    }

    public FarmerBid saveBid(FarmerBid bid) {
        // Prevent bid creation if request is not OPEN
        BuyerRequest br = bid.getBuyerRequest();
        if (br == null || br.getState() == null || !br.getState().name().equals("OPEN")) {
            throw new RuntimeException("Cannot place bid: Buyer request is not OPEN");
        }
        return farmerBidRepository.save(bid);
    }

    public List<FarmerBid> getBidsByBuyerRequest(Long buyerRequestId) {
        return farmerBidRepository.findByBuyerRequestId(buyerRequestId);
    }

    public List<FarmerBid> getBidsByFarmer(Long farmerId) {
        return farmerBidRepository.findByFarmerId(farmerId);
    }

    public Optional<FarmerBid> getBid(Long id) {
        return farmerBidRepository.findById(id);
    }

    public void deleteBid(Long id) {
        farmerBidRepository.deleteById(id);
    }

    public void acceptBid(Long bidId, Long buyerRequestId) {
        List<FarmerBid> bids = farmerBidRepository.findByBuyerRequestId(buyerRequestId);
        for (FarmerBid bid : bids) {
            if (bid.getId().equals(bidId)) {
                bid.setBidStatus(BidStatus.ACCEPTED);
            } else {
                bid.setBidStatus(BidStatus.REJECTED);
            }
        }
        farmerBidRepository.saveAll(bids);
        // Set buyer request state to CLOSED
        BuyerRequest br = buyerRequestRepository.findById(buyerRequestId).orElse(null);
        if (br != null) {
            br.setState(com.springcloud.common.enums.BuyerRequestState.CLOSED);
            buyerRequestRepository.save(br);
        }
    }

    // Map FarmerBid to FarmerBidResponseDto (including nested BuyerRequest fields)
    public static FarmerBidResponseDto toResponseDto(FarmerBid bid) {
        if (bid == null) return null;
        FarmerBidResponseDto dto = new FarmerBidResponseDto();
        dto.setId(bid.getId());
        dto.setBiddingPrice(bid.getBiddingPrice());
        dto.setLocation(bid.getLocation());
        dto.setDeadline(bid.getDeadline());
        dto.setNotes(bid.getNotes());
        dto.setBidStatus(bid.getBidStatus() != null ? bid.getBidStatus().name() : null);
        dto.setCreatedDate(bid.getCreatedDate());

        BuyerRequest br = bid.getBuyerRequest();
        if (br != null) {
            dto.setBuyerRequestId(br.getId());
            dto.setCrop(br.getCrop());
            dto.setBuyerUserId(br.getUserId());
            dto.setUnitMeasurement(br.getUnitMeasurement());
            dto.setQuantity(br.getQuantity());
            dto.setQuality(br.getQuality());
            dto.setPriceMin(br.getPriceMin());
            dto.setPriceMax(br.getPriceMax());
            dto.setBuyerLocation(br.getLocation());
            dto.setBuyerDeadline(br.getDeadline());
            dto.setBuyerNotes(br.getNotes());
            dto.setVisibility(br.getVisibility());
            dto.setDate(br.getDate());
        }
        return dto;
    }
}
