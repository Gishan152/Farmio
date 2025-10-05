package com.springcloud.controller;

import com.springcloud.dto.*;
import com.springcloud.service.SlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@Slf4j
public class SlotController {
    
    private final SlotService slotService;
    
    // Get all slots for a warehouse
    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<SlotResponseDTO>> getSlotsByWarehouse(
            @PathVariable Long warehouseId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to get slots for warehouse: {} by user: {}", warehouseId, userId);
        List<SlotResponseDTO> slots = slotService.getSlotsByWarehouse(warehouseId, userId);
        return ResponseEntity.ok(slots);
    }
    
    // Get available slots for a warehouse
    @GetMapping("/warehouse/{warehouseId}/available")
    public ResponseEntity<List<SlotResponseDTO>> getAvailableSlots(
            @PathVariable Long warehouseId,
            @RequestParam(required = false) Integer requiredCapacity,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to get available slots for warehouse: {} with capacity: {} by user: {}", 
                warehouseId, requiredCapacity, userId);
        List<SlotResponseDTO> slots = slotService.getAvailableSlots(warehouseId, requiredCapacity, userId);
        return ResponseEntity.ok(slots);
    }
    
    // Get warehouse utilization statistics
    @GetMapping("/warehouse/{warehouseId}/utilization")
    public ResponseEntity<Map<String, Object>> getWarehouseUtilization(
            @PathVariable Long warehouseId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to get utilization stats for warehouse: {} by user: {}", warehouseId, userId);
        Map<String, Object> utilization = slotService.getWarehouseUtilization(warehouseId, userId);
        return ResponseEntity.ok(utilization);
    }
    
    // Get slot by ID
    @GetMapping("/{slotId}")
    public ResponseEntity<SlotResponseDTO> getSlot(
            @PathVariable Long slotId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to get slot: {} by user: {}", slotId, userId);
        SlotResponseDTO slot = slotService.getSlotById(slotId, userId);
        return ResponseEntity.ok(slot);
    }
    
    // Create a new slot
    @PostMapping
    public ResponseEntity<SlotResponseDTO> createSlot(
            @Valid @RequestBody SlotRequestDTO requestDTO,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to create slot for warehouse: {} by user: {}", 
                requestDTO.getWarehouseId(), userId);
        SlotResponseDTO slot = slotService.createSlot(requestDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(slot);
    }
    
    // Bulk create slots
    @PostMapping("/bulk")
    public ResponseEntity<List<SlotResponseDTO>> createSlotsInBulk(
            @Valid @RequestBody BulkSlotCreationDTO requestDTO,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to create {} slots in bulk for warehouse: {} by user: {}", 
                requestDTO.getNumberOfSlots(), requestDTO.getWarehouseId(), userId);
        List<SlotResponseDTO> slots = slotService.createSlotsInBulk(requestDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(slots);
    }
    
    // Update slot
    @PutMapping("/{slotId}")
    public ResponseEntity<SlotResponseDTO> updateSlot(
            @PathVariable Long slotId,
            @Valid @RequestBody SlotRequestDTO requestDTO,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to update slot: {} by user: {}", slotId, userId);
        SlotResponseDTO slot = slotService.updateSlot(slotId, requestDTO, userId);
        return ResponseEntity.ok(slot);
    }
    
    // Delete slot
    @DeleteMapping("/{slotId}")
    public ResponseEntity<Void> deleteSlot(
            @PathVariable Long slotId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to delete slot: {} by user: {}", slotId, userId);
        slotService.deleteSlot(slotId, userId);
        return ResponseEntity.noContent().build();
    }
    
    // Reserve slot capacity
    @PostMapping("/{slotId}/reserve")
    public ResponseEntity<SlotResponseDTO> reserveSlotCapacity(
            @PathVariable Long slotId,
            @Valid @RequestBody SlotReservationDTO reservationDTO,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to reserve capacity in slot: {} by user: {}", slotId, userId);
        SlotResponseDTO slot = slotService.reserveSlotCapacity(slotId, reservationDTO, userId);
        return ResponseEntity.ok(slot);
    }
    
    // Release reservation
    @PostMapping("/{slotId}/release")
    public ResponseEntity<SlotResponseDTO> releaseReservation(
            @PathVariable Long slotId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("Received request to release reservation for slot: {} by user: {}", slotId, userId);
        SlotResponseDTO slot = slotService.releaseReservation(slotId, userId);
        return ResponseEntity.ok(slot);
    }
    
    // Clean up expired reservations (admin endpoint)
    @PostMapping("/cleanup-expired")
    public ResponseEntity<String> cleanupExpiredReservations() {
        log.info("Received request to cleanup expired reservations");
        slotService.cleanupExpiredReservations();
        return ResponseEntity.ok("Expired reservations cleaned up successfully");
    }
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Slot Management Service is running!");
    }
}