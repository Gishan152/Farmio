package com.springcloud.controller;

import com.springcloud.model.FarmerBid;
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

    @PostMapping
    public ResponseEntity<?> createBid(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Roles") String rolesCsv,
            @RequestBody FarmerBid bid) {
        // Only allow if user has ROLE_FARMER
        if (rolesCsv == null || !rolesCsv.contains("ROLE_FARMER")) {
            return ResponseEntity.status(403).body("Only farmers can place bids.");
        }
        // Optionally, set the farmerId from the header
        try {
            bid.setFarmerId(Long.valueOf(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid user id");
        }
        FarmerBid saved = farmerBidService.saveBid(bid);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{buyerRequestId}")
    public ResponseEntity<?> getBidsByBuyerRequest(
            @PathVariable Long buyerRequestId,
            @RequestHeader("X-User-Id") String userId) {
        // Only allow if the user is the owner of the buyer request
        if (!farmerBidService.isBuyerRequestOwner(buyerRequestId, userId)) {
            return ResponseEntity.status(403).body("Only the buyer who created the request can view the bids.");
        }
        return ResponseEntity.ok(farmerBidService.getBidsByBuyerRequest(buyerRequestId));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<?> getBidsByFarmer(
            @PathVariable Long farmerId,
            @RequestHeader("X-User-Id") String userId) {
        // Only allow if the user is the farmer
        if (!userId.equals(farmerId.toString())) {
            return ResponseEntity.status(403).body("You can only view your own bids.");
        }
        return ResponseEntity.ok(farmerBidService.getBidsByFarmer(farmerId));
    }

    @GetMapping("/{id}")
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
        return ResponseEntity.ok(bid);
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
