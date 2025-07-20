
package com.springcloud.controller;
import com.springcloud.common.enums.BidStatus;

import com.springcloud.model.FarmerBid;
import com.springcloud.dto.FarmerBidDto;
import com.springcloud.dto.FarmerBidResponseDto;
import com.springcloud.model.BuyerRequest;
import com.springcloud.repository.BuyerRequestRepository;
import com.springcloud.service.FarmerBidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order/buyer-requests/bids")
public class FarmerBidController {
    @Autowired
    private FarmerBidService farmerBidService;

    @Autowired
    private BuyerRequestRepository buyerRequestRepository;

    @PostMapping
    public ResponseEntity<?> createBid(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Roles") String rolesCsv,
            @RequestBody FarmerBidDto bidDto) {
        // Only allow if user has ROLE_FARMER
        if (rolesCsv == null || !rolesCsv.contains("ROLE_FARMER")) {
            return ResponseEntity.status(403).body("Only farmers can place bids.");
        }
        // Validate and map DTO to entity
        BuyerRequest buyerRequest = buyerRequestRepository.findById(bidDto.getBuyerRequestId()).orElse(null);
        if (buyerRequest == null) {
            return ResponseEntity.badRequest().body("Invalid buyerRequestId");
        }
        Long farmerId;
        try {
            farmerId = Long.valueOf(userId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid user id");
        }
        // Only allow bids on OPEN requests
        if (buyerRequest.getState() == null || !buyerRequest.getState().name().equals("OPEN")) {
            return ResponseEntity.status(400).body("Cannot place bid: Buyer request is not OPEN");
        }
        // Check if farmer already placed a bid for this buyer request
        if (farmerBidService.hasFarmerBidForRequest(farmerId, buyerRequest.getId())) {
            return ResponseEntity.status(409).body("You have already placed a bid for this buyer request.");
        }
        try {
            FarmerBid bid = new FarmerBid();
            bid.setBuyerRequest(buyerRequest);
            bid.setBiddingPrice(bidDto.getBiddingPrice());
            bid.setLocation(bidDto.getLocation());
            bid.setDeadline(bidDto.getDeadline());
            bid.setNotes(bidDto.getNotes());
            bid.setFarmerId(farmerId);
            bid.setBidStatus(BidStatus.PENDING);
            FarmerBid saved = farmerBidService.saveBid(bid);
            return ResponseEntity.ok(FarmerBidService.toResponseDto(saved));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    // Endpoint for buyer to accept a bid
    @PostMapping("/accept/{bidId}")
    public ResponseEntity<?> acceptBid(
            @PathVariable Long bidId,
            @RequestHeader("X-User-Id") String userId) {
        // Find the bid and check if the user is the owner of the buyer request
        var bidOpt = farmerBidService.getBid(bidId);
        if (bidOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var bid = bidOpt.get();
        if (!farmerBidService.isBuyerRequestOwner(bid.getBuyerRequest().getId(), userId)) {
            return ResponseEntity.status(403).body("Only the buyer who created the request can accept a bid.");
        }
        farmerBidService.acceptBid(bidId, bid.getBuyerRequest().getId());
        return ResponseEntity.ok("Bid accepted and others rejected.");
    }

    @GetMapping("/{buyerRequestId}")
    public ResponseEntity<?> getBidsByBuyerRequest(
            @PathVariable Long buyerRequestId,
            @RequestHeader("X-User-Id") String userId) {
        // Only allow if the user is the owner of the buyer request
        if (!farmerBidService.isBuyerRequestOwner(buyerRequestId, userId)) {
            return ResponseEntity.status(403).body("Only the buyer who created the request can view the bids.");
        }
        List<FarmerBid> bids = farmerBidService.getBidsByBuyerRequest(buyerRequestId);
        List<FarmerBidResponseDto> dtos = bids.stream().map(FarmerBidService::toResponseDto).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/farmer")
    public ResponseEntity<?> getBidsByFarmer(
            @RequestHeader("X-User-Id") String userId) {
        List<FarmerBid> bids = farmerBidService.getBidsByFarmer(Long.valueOf(userId));
        List<FarmerBidResponseDto> dtos = bids.stream().map(FarmerBidService::toResponseDto).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/single/{id}")
    public ResponseEntity<?> getBid(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        var bidOpt = farmerBidService.getBid(id);
        if (bidOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var bid = bidOpt.get();
        if (!userId.equals(bid.getFarmerId().toString())) {
            return ResponseEntity.status(403).body("You can only view your own bid.");
        }
        return ResponseEntity.ok(FarmerBidService.toResponseDto(bid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBid(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        var bidOpt = farmerBidService.getBid(id);
        if (bidOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var bid = bidOpt.get();
        if (!userId.equals(bid.getFarmerId().toString())) {
            return ResponseEntity.status(403).body("You can only delete your own bid.");
        }
        farmerBidService.deleteBid(id);
        return ResponseEntity.noContent().build();
    }
}
