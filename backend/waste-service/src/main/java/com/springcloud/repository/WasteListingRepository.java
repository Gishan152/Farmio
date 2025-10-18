package com.springcloud.repository;


import com.springcloud.model.WasteListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WasteListingRepository extends JpaRepository<WasteListing, Long> {
    // Example: find all listings by status
    // List<WasteListing> findByStatus(String status);
}
