package com.springcloud.repository;


import com.springcloud.model.WasteListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WasteListingRepository extends JpaRepository<WasteListing, Long> {
    // Example: find all listings by status
    // List<WasteListing> findByStatus(String status);
    
    // Find all listings accepted by a specific waste agent
    List<WasteListing> findByAcceptedBy(Long acceptedBy);
}
