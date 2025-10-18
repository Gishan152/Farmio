package com.springcloud.controller;

import com.springcloud.dto.WasteListingDTO;
import com.springcloud.mapper.WasteListingMapper;
import com.springcloud.model.WasteListing;
import com.springcloud.service.WasteListingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waste/listings")
//@CrossOrigin(origins = "http://localhost:5173")
public class WasteListingController {

    private final WasteListingService wasteListingService;
    private final WasteListingMapper wasteListingMapper;

    public WasteListingController(WasteListingService wasteListingService, WasteListingMapper wasteListingMapper) {
        this.wasteListingService = wasteListingService;
        this.wasteListingMapper = wasteListingMapper;
    }

    // @GetMapping
    // public List<WasteListingDTO> getAllWasteListings() {
    //     return wasteListingService.getAllWasteListings()
    //             .stream()
    //             .map(wasteListingMapper::toDTO)
    //             .toList();
    // }

    // Return listings assigned to the current waste agent (accepted_by = X-User-Id)
    @GetMapping
    public List<WasteListingDTO> getMyWasteListings(@RequestHeader("X-User-Id") String userId) {
        Long agentId = Long.valueOf(userId);
        return wasteListingService.getAllByAcceptedBy(agentId)
                .stream()
                .map(wasteListingMapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public WasteListingDTO getWasteListingById(@PathVariable Long id) {
        return wasteListingMapper.toDTO(wasteListingService.getWasteListingById(id));
    }

    @PutMapping("/{id}/status")
    public WasteListingDTO updateStatus(@PathVariable Long id, @RequestParam String status) {
        var updated = wasteListingService.updateStatus(id, status);
        return wasteListingMapper.toDTO(updated);
    }
}

