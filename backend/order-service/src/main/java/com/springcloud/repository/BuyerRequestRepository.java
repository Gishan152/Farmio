package com.springcloud.repository;

import com.springcloud.model.BuyerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuyerRequestRepository extends JpaRepository<BuyerRequest, Long> {
    java.util.List<com.springcloud.model.BuyerRequest> findByUserId(Long userId);
}
