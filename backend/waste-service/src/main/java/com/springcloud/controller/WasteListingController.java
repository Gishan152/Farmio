package com.springcloud.controller;

import com.springcloud.model.WasteListing;
import com.springcloud.service.WasteListingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/waste-listings")
public class WasteListingController {

    private final WasteListingService wasteListingService;

    public WasteListingController(WasteListingService wasteListingService) {
        this.wasteListingService = wasteListingService;
    }

    // GET /waste-listings → list all waste listings
    @GetMapping
    public List<WasteListing> getAllWasteListings() {
        return wasteListingService.getAllWasteListings();
    }

    // GET /waste-listings/{id} → get one waste listing by ID
    @GetMapping("/{id}")
    public WasteListing getWasteListingById(@PathVariable Long id) {
        return wasteListingService.getWasteListingById(id);
    }

    @PutMapping("/{id}/status")
    public WasteListing updateStatus(@PathVariable Long id, @RequestParam String status) {
        return wasteListingService.updateStatus(id, status);
    }

}
