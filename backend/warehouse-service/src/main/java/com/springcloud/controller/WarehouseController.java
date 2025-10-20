package com.springcloud.controller;

import com.springcloud.dto.WarehouseRequestDTO;
import com.springcloud.dto.WarehouseResponseDTO;
import com.springcloud.dto.WarehouseSearchRequestDTO;
import com.springcloud.dto.LocationUpdateDTO;
import com.springcloud.dto.WarehouseCapacityDTO;
import com.springcloud.service.WarehouseService;
import com.springcloud.service.CityCoordinatesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
@Slf4j
public class WarehouseController {
    
    private final WarehouseService warehouseService;
    private final CityCoordinatesService cityCoordinatesService;
    
    @GetMapping
    public ResponseEntity<List<WarehouseResponseDTO>> getAllWarehouses(
            @RequestParam(required = false) String search,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to get warehouses for user: {} with search: {}", userId, search);
        List<WarehouseResponseDTO> warehouses;
        if (search != null && !search.trim().isEmpty()) {
            warehouses = warehouseService.searchWarehouses(search, userId);
        } else {
            warehouses = warehouseService.getAllWarehousesByOwner(userId);
        }
        return ResponseEntity.ok(warehouses);
    }
    
    @GetMapping("/{warehouseId}")
    public ResponseEntity<WarehouseResponseDTO> getWarehouse(
            @PathVariable Long warehouseId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to get warehouse: {} for user: {}", warehouseId, userId);
        WarehouseResponseDTO warehouse = warehouseService.getWarehouseById(warehouseId, userId);
        return ResponseEntity.ok(warehouse);
    }
    
    @PostMapping
    public ResponseEntity<WarehouseResponseDTO> createWarehouse(
            @Valid @RequestBody WarehouseRequestDTO requestDTO,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to create warehouse for user: {}", userId);
        WarehouseResponseDTO warehouse = warehouseService.createWarehouse(requestDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(warehouse);
    }
    
    @PutMapping("/{warehouseId}")
    public ResponseEntity<WarehouseResponseDTO> updateWarehouse(
            @PathVariable Long warehouseId,
            @Valid @RequestBody WarehouseRequestDTO requestDTO,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to update warehouse: {} for user: {}", warehouseId, userId);
        WarehouseResponseDTO warehouse = warehouseService.updateWarehouse(warehouseId, requestDTO, userId);
        return ResponseEntity.ok(warehouse);
    }
    
    @DeleteMapping("/{warehouseId}")
    public ResponseEntity<Void> deleteWarehouse(
            @PathVariable Long warehouseId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to delete warehouse: {} for user: {}", warehouseId, userId);
        warehouseService.deleteWarehouse(warehouseId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<WarehouseResponseDTO>> searchWarehouses(
            @RequestParam String searchTerm,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to search warehouses with term: {} for user: {}", searchTerm, userId);
        List<WarehouseResponseDTO> warehouses = warehouseService.searchWarehouses(searchTerm, userId);
        return ResponseEntity.ok(warehouses);
    }
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Warehouse Service is running!");
    }
    
    // Public endpoints for buyers/farmers (no authentication required)
    @GetMapping("/public")
    public ResponseEntity<List<WarehouseResponseDTO>> getPublicWarehouses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String storageType,
            @RequestParam(required = false) Double minCapacity,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "false") Boolean verifiedOnly) {
        log.info("Public request for warehouses - search: {}, city: {}, storageType: {}, minCapacity: {}, maxPrice: {}, verifiedOnly: {}", 
                search, city, storageType, minCapacity, maxPrice, verifiedOnly);
        List<WarehouseResponseDTO> warehouses = warehouseService.getPublicWarehouses(search, city, storageType, minCapacity, maxPrice, verifiedOnly);
        return ResponseEntity.ok(warehouses);
    }

    // Location-based search for nearby warehouses
    @GetMapping("/public/nearby")
    public ResponseEntity<List<WarehouseResponseDTO>> getNearbyWarehouses(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "50") Integer radiusKm,
            @RequestParam(required = false) String storageType,
            @RequestParam(required = false) Double minCapacity,
            @RequestParam(defaultValue = "20") Integer limit) {
        log.info("Public request for nearby warehouses - lat: {}, lng: {}, radius: {}km, storageType: {}, minCapacity: {}", 
                latitude, longitude, radiusKm, storageType, minCapacity);
        List<WarehouseResponseDTO> warehouses = warehouseService.getNearbyWarehouses(
                latitude, longitude, radiusKm, storageType, minCapacity, limit);
        return ResponseEntity.ok(warehouses);
    }
    
    @GetMapping("/public/{warehouseId}")
    public ResponseEntity<WarehouseResponseDTO> getPublicWarehouse(@PathVariable Long warehouseId) {
        log.info("Public request for warehouse: {}", warehouseId);
        WarehouseResponseDTO warehouse = warehouseService.getPublicWarehouse(warehouseId);
        return ResponseEntity.ok(warehouse);
    }
    
    @GetMapping("/{warehouseId}/capacity")
    public ResponseEntity<WarehouseCapacityDTO> getWarehouseCapacity(@PathVariable Long warehouseId) {
        log.info("Request for warehouse capacity: {}", warehouseId);
        WarehouseCapacityDTO capacity = warehouseService.getWarehouseCapacity(warehouseId);
        return ResponseEntity.ok(capacity);
    }
    
    // Enhanced search endpoint for frontend
    @PostMapping("/public/search")
    public ResponseEntity<List<WarehouseResponseDTO>> searchWarehousesAdvanced(
            @RequestBody WarehouseSearchRequestDTO searchRequest) {
        log.info("Advanced warehouse search request: {}", searchRequest);
        List<WarehouseResponseDTO> warehouses = warehouseService.searchWarehousesAdvanced(searchRequest);
        return ResponseEntity.ok(warehouses);
    }
    
    // Location update endpoints for fixing null coordinates
    @PutMapping("/{warehouseId}/location")
    public ResponseEntity<WarehouseResponseDTO> updateWarehouseLocation(
            @PathVariable Long warehouseId,
            @RequestBody @Valid LocationUpdateDTO locationDTO,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Updating location for warehouse: {} by user: {}", warehouseId, userId);
        
        // Set the warehouse ID from path parameter
        locationDTO.setWarehouseId(warehouseId);
        
        WarehouseResponseDTO updated = warehouseService.updateWarehouseLocation(warehouseId, locationDTO, userId);
        return ResponseEntity.ok(updated);
    }
    
    @PostMapping("/locations/batch-update")
    public ResponseEntity<List<WarehouseResponseDTO>> batchUpdateWarehouseLocations(
            @RequestBody @Valid List<LocationUpdateDTO> locationUpdates,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Batch updating locations for {} warehouses by user: {}", locationUpdates.size(), userId);
        
        List<WarehouseResponseDTO> updated = warehouseService.batchUpdateWarehouseLocations(locationUpdates, userId);
        return ResponseEntity.ok(updated);
    }
    
    // Utility endpoint to get coordinates for a specific city
    @GetMapping("/cities/{cityName}/coordinates")
    public ResponseEntity<Map<String, Object>> getCityCoordinates(@PathVariable String cityName) {
        log.info("Getting coordinates for city: {}", cityName);
        
        Double latitude = cityCoordinatesService.getLatitudeForCity(cityName);
        Double longitude = cityCoordinatesService.getLongitudeForCity(cityName);
        
        Map<String, Object> response = new HashMap<>();
        response.put("city", cityName);
        response.put("latitude", latitude);
        response.put("longitude", longitude);
        response.put("found", latitude != null && longitude != null);
        
        if (latitude != null && longitude != null) {
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Coordinates not found for city: " + cityName);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
