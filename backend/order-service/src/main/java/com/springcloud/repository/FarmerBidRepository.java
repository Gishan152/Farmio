package com.springcloud.repository;

import com.springcloud.model.FarmerBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FarmerBidRepository extends JpaRepository<FarmerBid, Long> {
    List<FarmerBid> findByBuyerRequestId(Long buyerRequestId);
    List<FarmerBid> findByFarmerId(Long farmerId);
}
