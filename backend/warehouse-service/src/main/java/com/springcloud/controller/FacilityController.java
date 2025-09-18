package com.springcloud.controller;

import com.springcloud.dto.FacilityRequestDTO;
import com.springcloud.dto.FacilityResponseDTO;
import com.springcloud.dto.LocationDTO;
import com.springcloud.model.FacilityStatus;
import com.springcloud.service.FacilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class FacilityController {
    
    private final FacilityService facilityService;
    
    @GetMapping
    public ResponseEntity<List<FacilityResponseDTO>> getAllFacilities(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to get all facilities for user: {}", userId);
        List<FacilityResponseDTO> facilities = facilityService.getAllFacilitiesByOwner(userId);
        return ResponseEntity.ok(facilities);
    }
    
    @GetMapping("/{facilityId}")
    public ResponseEntity<FacilityResponseDTO> getFacility(
            @PathVariable Long facilityId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to get facility: {} for user: {}", facilityId, userId);
        FacilityResponseDTO facility = facilityService.getFacilityById(facilityId, userId);
        return ResponseEntity.ok(facility);
    }
    
    @PostMapping
    public ResponseEntity<FacilityResponseDTO> createFacility(
            @Valid @RequestBody FacilityRequestDTO requestDTO,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to create facility for user: {}", userId);
        FacilityResponseDTO facility = facilityService.createFacility(requestDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(facility);
    }
    
    @PutMapping("/{facilityId}")
    public ResponseEntity<FacilityResponseDTO> updateFacility(
            @PathVariable Long facilityId,
            @Valid @RequestBody FacilityRequestDTO requestDTO,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to update facility: {} for user: {}", facilityId, userId);
        FacilityResponseDTO facility = facilityService.updateFacility(facilityId, requestDTO, userId);
        return ResponseEntity.ok(facility);
    }
    
    @DeleteMapping("/{facilityId}")
    public ResponseEntity<Void> deleteFacility(
            @PathVariable Long facilityId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to delete facility: {} for user: {}", facilityId, userId);
        facilityService.deleteFacility(facilityId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<FacilityResponseDTO>> searchFacilities(
            @RequestParam String searchTerm,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to search facilities with term: {} for user: {}", searchTerm, userId);
        List<FacilityResponseDTO> facilities = facilityService.searchFacilities(searchTerm, userId);
        return ResponseEntity.ok(facilities);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<FacilityResponseDTO>> getAvailableFacilities() {
        log.info("Received request to get available facilities");
        List<FacilityResponseDTO> facilities = facilityService.getAvailableFacilities();
        return ResponseEntity.ok(facilities);
    }
    
    @PatchMapping("/{facilityId}/status")
    public ResponseEntity<FacilityResponseDTO> updateFacilityStatus(
            @PathVariable Long facilityId,
            @RequestParam FacilityStatus status,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to update facility status: {} to {} for user: {}", facilityId, status, userId);
        FacilityResponseDTO facility = facilityService.updateFacilityStatus(facilityId, status, userId);
        return ResponseEntity.ok(facility);
    }
    
    // Location-related endpoints
    @PostMapping("/geocode")
    public ResponseEntity<LocationDTO> geocodeAddress(@RequestParam String address) {
        log.info("Received request to geocode address: {}", address);
        Optional<LocationDTO> location = facilityService.geocodeAddress(address);
        return location.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/reverse-geocode")
    public ResponseEntity<LocationDTO> reverseGeocode(
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        log.info("Received request to reverse geocode coordinates: {}, {}", latitude, longitude);
        try {
            Optional<LocationDTO> location = facilityService.reverseGeocode(latitude, longitude);
            return location.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            log.error("Invalid coordinates provided: {}, {}", latitude, longitude);
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Facility Management Service is running!");
    }
} 