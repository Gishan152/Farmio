package com.springcloud.controller;

import com.springcloud.dto.*;
import com.springcloud.service.SlotService;
import com.springcloud.service.WarehouseService;
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
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@Slf4j
public class SlotController {

    private final SlotService slotService;
    private final WarehouseService warehouseService;

    /* ----------- warehouse-wise slots ----------- */
    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<SlotResponseDTO>> getSlotsByWarehouse(
            @PathVariable Long warehouseId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("get slots for warehouse {} by user {}", warehouseId, userId);
        return ResponseEntity.ok(slotService.getSlotsByWarehouse(warehouseId, userId));
    }

    @GetMapping("/by-warehouse")
    public ResponseEntity<Map<Long, List<SlotResponseDTO>>> getAllWarehousesWithSlots(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("get all warehouses with slots for user {}", userId);
        var warehouses = warehouseService.getAllWarehousesByOwner(userId);
        Map<Long, List<SlotResponseDTO>> map = new HashMap<>();
        for (var w : warehouses) {
            map.put(w.getId(), slotService.getSlotsByWarehouse(w.getId(), userId));
        }
        return ResponseEntity.ok(map);
    }

    /* ----------- single slot ----------- */
    @GetMapping("/{slotId}")
    public SlotResponseDTO getSlot(@PathVariable Long slotId,
                                   @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        return slotService.getSlotById(slotId, userId);
    }

    /* ----------- CRUD ----------- */
    @PostMapping
    public ResponseEntity<SlotResponseDTO> createSlot(@Valid @RequestBody SlotRequestDTO dto,
                                                      @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        var saved = slotService.createSlot(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{slotId}")
    public SlotResponseDTO updateSlot(@PathVariable Long slotId,
                                      @Valid @RequestBody SlotRequestDTO dto,
                                      @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        return slotService.updateSlot(slotId, dto, userId);
    }

    @DeleteMapping("/{slotId}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long slotId,
                                           @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        slotService.deleteSlot(slotId, userId);
        return ResponseEntity.noContent().build();
    }

    /* ----------- util ----------- */
    @GetMapping("/warehouse/{warehouseId}/available")
    public List<SlotResponseDTO> availableSlots(@PathVariable Long warehouseId,
                                                @RequestParam(required = false) Integer requiredCapacity,
                                                @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        return slotService.getAvailableSlots(warehouseId, requiredCapacity, userId);
    }

    @GetMapping("/warehouse/{warehouseId}/utilization")
    public Map<String, Object> utilization(@PathVariable Long warehouseId,
                                           @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        return slotService.getWarehouseUtilization(warehouseId, userId);
    }

    @PostMapping("/cleanup-expired")
    public ResponseEntity<String> cleanup() {
        slotService.cleanupExpiredReservations();
        return ResponseEntity.ok("Expired reservations cleaned");
    }

    /* ----------- health ----------- */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Slot Management Service is running!");
    }
}