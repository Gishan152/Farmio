import com.springcloud.model.BuyerRequest;
import com.springcloud.repository.BuyerRequestRepository;

package com.springcloud.service;

import com.springcloud.model.FarmerBid;
import com.springcloud.repository.FarmerBidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FarmerBidService {
    @Autowired
    private FarmerBidRepository farmerBidRepository;

    public boolean isBuyerRequestOwner(Long buyerRequestId, String userId) {
        BuyerRequest req = buyerRequestRepository.findById(buyerRequestId).orElse(null);
        if (req == null || req.getUserId() == null) return false;
        return req.getUserId().toString().equals(userId);
    }

    public FarmerBid saveBid(FarmerBid bid) {
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
}
