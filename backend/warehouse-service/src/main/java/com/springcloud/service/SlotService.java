package com.springcloud.service;

import com.springcloud.dto.*;
import com.springcloud.exception.ResourceNotFoundException;
import com.springcloud.exception.BadRequestException;
import com.springcloud.model.Slot;
import com.springcloud.model.SlotStatus;
import com.springcloud.model.Warehouse;
import com.springcloud.repository.SlotRepository;
import com.springcloud.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SlotService {
    
    private final SlotRepository slotRepository;
    private final WarehouseRepository warehouseRepository;
    
    // Get all slots for a warehouse
    public List<SlotResponseDTO> getSlotsByWarehouse(Long warehouseId, Long userId) {
        log.info("Getting slots for warehouse: {} by user: {}", warehouseId, userId);
        
        // Verify warehouse exists and user has access
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + warehouseId));
        
        if (!warehouse.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have access to this warehouse");
        }
        
        List<Slot> slots = slotRepository.findByWarehouseIdOrderBySlotNumberAsc(warehouseId);
        return slots.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }
    
    // Get slot by ID
    public SlotResponseDTO getSlotById(Long slotId, Long userId) {
        log.info("Getting slot: {} by user: {}", slotId, userId);
        
        Slot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));
        
        // Verify user has access to the warehouse
        Warehouse warehouse = warehouseRepository.findById(slot.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        
        if (!warehouse.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have access to this slot");
        }
        
        return mapToResponseDTO(slot);
    }
    
    // Create a new slot
    public SlotResponseDTO createSlot(SlotRequestDTO requestDTO, Long userId) {
        log.info("Creating new slot for warehouse: {} by user: {}", requestDTO.getWarehouseId(), userId);
        
        // Verify warehouse exists and user has access
        Warehouse warehouse = warehouseRepository.findById(requestDTO.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + requestDTO.getWarehouseId()));
        
        if (!warehouse.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have access to this warehouse");
        }
        
        // Check if slot number already exists in this warehouse
        if (slotRepository.existsByWarehouseIdAndSlotNumber(requestDTO.getWarehouseId(), requestDTO.getSlotNumber())) {
            throw new BadRequestException("Slot number already exists in this warehouse: " + requestDTO.getSlotNumber());
        }
        
        Slot slot = mapToEntity(requestDTO);
        Slot savedSlot = slotRepository.save(slot);
        
        log.info("Created slot with id: {}", savedSlot.getId());
        return mapToResponseDTO(savedSlot);
    }   
    
    // Update slot
    public SlotResponseDTO updateSlot(Long slotId, SlotRequestDTO requestDTO, Long userId) {
        log.info("Updating slot: {} by user: {}", slotId, userId);
        
        Slot existingSlot = slotRepository.findById(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));
        
        // Verify user has access to the warehouse
        Warehouse warehouse = warehouseRepository.findById(existingSlot.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        
        if (!warehouse.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have access to this slot");
        }
        
        // Check if slot number is being changed and if it conflicts
        if (!existingSlot.getSlotNumber().equals(requestDTO.getSlotNumber())) {
            if (slotRepository.existsByWarehouseIdAndSlotNumber(requestDTO.getWarehouseId(), requestDTO.getSlotNumber())) {
                throw new BadRequestException("Slot number already exists in this warehouse: " + requestDTO.getSlotNumber());
            }
        }
        
        updateSlotFromDTO(existingSlot, requestDTO);
        Slot updatedSlot = slotRepository.save(existingSlot);
        
        log.info("Updated slot with id: {}", updatedSlot.getId());
        return mapToResponseDTO(updatedSlot);
    }
    
    // Delete slot
    public void deleteSlot(Long slotId, Long userId) {
        log.info("Deleting slot: {} by user: {}", slotId, userId);
        
        Slot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));
        
        // Verify user has access to the warehouse
        Warehouse warehouse = warehouseRepository.findById(slot.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        
        if (!warehouse.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have access to this slot");
        }
        
        // Check if slot is occupied or reserved
        if (slot.getCurrentLoadKg() > 0) {
            throw new BadRequestException("Cannot delete slot that contains products");
        }
        
        if (slot.getReservedLoadKg() > 0) {
            throw new BadRequestException("Cannot delete slot that has reservations");
        }
        
        slotRepository.delete(slot);
        log.info("Deleted slot with id: {}", slotId);
    }
    
    // Reserve slot capacity
    public SlotResponseDTO reserveSlotCapacity(Long slotId, SlotReservationDTO reservationDTO, Long userId) {
        log.info("Reserving capacity in slot: {} by user: {}", slotId, userId);
        
        Slot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));
        
        // Verify user has access to the warehouse
        Warehouse warehouse = warehouseRepository.findById(slot.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        
        if (!warehouse.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have access to this slot");
        }
        
        // Check if slot has sufficient capacity
        if (slot.getAvailableCapacity() < reservationDTO.getCapacityToReserve()) {
            throw new BadRequestException("Insufficient capacity available in slot. Available: " + 
                slot.getAvailableCapacity() + " kg, Requested: " + reservationDTO.getCapacityToReserve() + " kg");
        }
        
        // Update slot reservation
        slot.setReservedLoadKg(slot.getReservedLoadKg() + reservationDTO.getCapacityToReserve());
        slot.setReservedByUserId(userId);
        slot.setReservedUntil(reservationDTO.getReservedUntil());
        slot.setProductType(reservationDTO.getProductType());
        slot.setNotes(reservationDTO.getNotes());
        slot.setStatus(SlotStatus.RESERVED);
        
        Slot updatedSlot = slotRepository.save(slot);
        log.info("Reserved {} kg in slot: {}", reservationDTO.getCapacityToReserve(), slotId);
        
        return mapToResponseDTO(updatedSlot);
    }
    
    // Release reservation
    public SlotResponseDTO releaseReservation(Long slotId, Long userId) {
        log.info("Releasing reservation for slot: {} by user: {}", slotId, userId);
        
        Slot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));
        
        // Verify user has access to the warehouse
        Warehouse warehouse = warehouseRepository.findById(slot.getWarehouseId())
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        
        if (!warehouse.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have access to this slot");
        }
        
        // Clear reservation
        slot.setReservedLoadKg(0);
        slot.setReservedByUserId(null);
        slot.setReservedUntil(null);
        slot.setProductType(null);
        slot.setStatus(SlotStatus.AVAILABLE);
        
        Slot updatedSlot = slotRepository.save(slot);
        log.info("Released reservation for slot: {}", slotId);
        
        return mapToResponseDTO(updatedSlot);
    }
    
    // Get available slots with sufficient capacity
    public List<SlotResponseDTO> getAvailableSlots(Long warehouseId, Integer requiredCapacity, Long userId) {
        log.info("Getting available slots for warehouse: {} with capacity: {} by user: {}", 
                warehouseId, requiredCapacity, userId);
        
        // Verify warehouse exists and user has access
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + warehouseId));
        
        if (!warehouse.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have access to this warehouse");
        }
        
        List<Slot> slots;
        if (requiredCapacity != null && requiredCapacity > 0) {
            slots = slotRepository.findSlotsWithSufficientCapacity(warehouseId, requiredCapacity);
        } else {
            slots = slotRepository.findAvailableSlotsByWarehouse(warehouseId);
        }
        
        return slots.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }
    
    // Get warehouse utilization statistics
    public Map<String, Object> getWarehouseUtilization(Long warehouseId, Long userId) {
        log.info("Getting utilization stats for warehouse: {} by user: {}", warehouseId, userId);
        
        // Verify warehouse exists and user has access
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
            .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + warehouseId));
        
        if (!warehouse.getOwnerId().equals(userId)) {
            throw new BadRequestException("You don't have access to this warehouse");
        }
        
        Object[] stats = slotRepository.getWarehouseUtilizationStats(warehouseId);
        List<Object[]> statusCounts = slotRepository.countSlotsByStatusForWarehouse(warehouseId);
        
        Map<String, Object> utilization = new HashMap<>();
        
        if (stats != null && stats.length >= 4 && stats[0] != null) {
            // Handle different number types that might be returned by JPA queries
            Long totalSlots = convertToLong(stats[0]);
            Long totalCapacity = stats[1] != null ? convertToLong(stats[1]) : 0L;
            Long currentLoad = stats[2] != null ? convertToLong(stats[2]) : 0L;
            Long reservedLoad = stats[3] != null ? convertToLong(stats[3]) : 0L;
            
            utilization.put("totalSlots", totalSlots);
            utilization.put("totalCapacity", totalCapacity);
            utilization.put("currentLoad", currentLoad);
            utilization.put("reservedLoad", reservedLoad);
            utilization.put("availableCapacity", totalCapacity - currentLoad - reservedLoad);
            utilization.put("utilizationPercentage", totalCapacity > 0 ? 
                ((double)(currentLoad + reservedLoad) / totalCapacity) * 100 : 0.0);
        } else {
            // No data case
            utilization.put("totalSlots", 0L);
            utilization.put("totalCapacity", 0L);
            utilization.put("currentLoad", 0L);
            utilization.put("reservedLoad", 0L);
            utilization.put("availableCapacity", 0L);
            utilization.put("utilizationPercentage", 0.0);
        }
        
        Map<String, Long> statusBreakdown = new HashMap<>();
        for (Object[] statusCount : statusCounts) {
            SlotStatus status = (SlotStatus) statusCount[0];
            Long count = (Long) statusCount[1];
            statusBreakdown.put(status.name(), count);
        }
        utilization.put("statusBreakdown", statusBreakdown);
        
        return utilization;
    }
    
    // Clean up expired reservations
    @Transactional
    public void cleanupExpiredReservations() {
        log.info("Cleaning up expired reservations");
        
        List<Slot> expiredSlots = slotRepository.findExpiredReservations(LocalDateTime.now());
        
        for (Slot slot : expiredSlots) {
            slot.setReservedLoadKg(0);
            slot.setReservedByUserId(null);
            slot.setReservedUntil(null);
            slot.setProductType(null);
            slot.setStatus(SlotStatus.AVAILABLE);
        }
        
        if (!expiredSlots.isEmpty()) {
            slotRepository.saveAll(expiredSlots);
            log.info("Cleaned up {} expired reservations", expiredSlots.size());
        }
    }
    
    // Helper methods for mapping
    private SlotResponseDTO mapToResponseDTO(Slot slot) {
        SlotResponseDTO dto = new SlotResponseDTO();
        dto.setId(slot.getId());
        dto.setSlotNumber(slot.getSlotNumber());
        dto.setWarehouseId(slot.getWarehouseId());
        dto.setStatus(slot.getStatus());
        dto.setCapacityKg(slot.getCapacityKg());
        dto.setCurrentLoadKg(slot.getCurrentLoadKg());
        dto.setReservedLoadKg(slot.getReservedLoadKg());
        dto.setAvailableCapacity(slot.getAvailableCapacity());
        dto.setUtilizationPercentage(slot.getUtilizationPercentage());
        dto.setProductType(slot.getProductType());
        dto.setReservedByUserId(slot.getReservedByUserId());
        dto.setReservedUntil(slot.getReservedUntil());
        dto.setLastCleaned(slot.getLastCleaned());
        dto.setTemperature(slot.getTemperature());
        dto.setHumidity(slot.getHumidity());
        dto.setNotes(slot.getNotes());
        dto.setCreatedAt(slot.getCreatedAt());
        dto.setUpdatedAt(slot.getUpdatedAt());
        dto.setAvailable(slot.isAvailable());
        dto.setReserved(slot.isReserved());
        
        // Set warehouse name if warehouse is loaded
        if (slot.getWarehouse() != null) {
            dto.setWarehouseName(slot.getWarehouse().getName());
        }
        
        return dto;
    }
    
    private Slot mapToEntity(SlotRequestDTO dto) {
        Slot slot = new Slot();
        slot.setSlotNumber(dto.getSlotNumber());
        slot.setWarehouseId(dto.getWarehouseId());
        slot.setStatus(dto.getStatus());
        slot.setCapacityKg(dto.getCapacityKg());
        slot.setCurrentLoadKg(dto.getCurrentLoadKg() != null ? dto.getCurrentLoadKg() : 0);
        slot.setReservedLoadKg(dto.getReservedLoadKg() != null ? dto.getReservedLoadKg() : 0);
        slot.setProductType(dto.getProductType());
        slot.setReservedByUserId(dto.getReservedByUserId());
        slot.setReservedUntil(dto.getReservedUntil());
        slot.setLastCleaned(dto.getLastCleaned());
        slot.setTemperature(dto.getTemperature());
        slot.setHumidity(dto.getHumidity());
        slot.setNotes(dto.getNotes());
        return slot;
    }
    
    private void updateSlotFromDTO(Slot slot, SlotRequestDTO dto) {
        slot.setSlotNumber(dto.getSlotNumber());
        slot.setWarehouseId(dto.getWarehouseId());
        slot.setStatus(dto.getStatus());
        slot.setCapacityKg(dto.getCapacityKg());
        slot.setCurrentLoadKg(dto.getCurrentLoadKg() != null ? dto.getCurrentLoadKg() : slot.getCurrentLoadKg());
        slot.setReservedLoadKg(dto.getReservedLoadKg() != null ? dto.getReservedLoadKg() : slot.getReservedLoadKg());
        slot.setProductType(dto.getProductType());
        slot.setReservedByUserId(dto.getReservedByUserId());
        slot.setReservedUntil(dto.getReservedUntil());
        slot.setLastCleaned(dto.getLastCleaned());
        slot.setTemperature(dto.getTemperature());
        slot.setHumidity(dto.getHumidity());
        slot.setNotes(dto.getNotes());
    }
    
    // Helper method to safely convert Number objects to Long
    private Long convertToLong(Object value) {
        if (value == null) {
            return 0L;
        }
        if (value instanceof Long) {
            return (Long) value;
        }
        if (value instanceof Integer) {
            return ((Integer) value).longValue();
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return 0L;
    }
}