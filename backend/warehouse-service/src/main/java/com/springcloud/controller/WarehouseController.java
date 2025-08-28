package com.springcloud.controller;

import com.springcloud.dto.WarehouseRequestDTO;
import com.springcloud.dto.WarehouseResponseDTO;
import com.springcloud.service.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class WarehouseController {
    
    private final WarehouseService warehouseService;
    
    @GetMapping
    public ResponseEntity<List<WarehouseResponseDTO>> getAllWarehouses(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to get all warehouses for user: {}", userId);
        List<WarehouseResponseDTO> warehouses = warehouseService.getAllWarehousesByOwner(userId);
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
}
