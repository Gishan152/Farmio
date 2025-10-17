package com.springcloud.service;

import com.springcloud.model.WasteListing;
import com.springcloud.repository.WasteListingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WasteListingService {

    private final WasteListingRepository wasteListingRepository;

    public WasteListingService(WasteListingRepository wasteListingRepository) {
        this.wasteListingRepository = wasteListingRepository;
    }

    public List<WasteListing> getAllWasteListings() {
        return wasteListingRepository.findAll();
    }

    public WasteListing getWasteListingById(Long id) {
        return wasteListingRepository.findById(id).orElse(null);
    }

    public WasteListing updateStatus(Long id, String newStatus) {
        WasteListing listing = wasteListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        listing.setStatus(String.valueOf(newStatus));
        return wasteListingRepository.save(listing);
    }
}
