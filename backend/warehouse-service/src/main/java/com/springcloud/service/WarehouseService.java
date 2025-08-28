package com.springcloud.service;

import com.springcloud.dto.WarehouseRequestDTO;
import com.springcloud.dto.WarehouseResponseDTO;
import com.springcloud.model.Warehouse;
import com.springcloud.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WarehouseService {
    
    private final WarehouseRepository warehouseRepository;
    
    public List<WarehouseResponseDTO> getAllWarehousesByOwner(Long ownerId) {
        log.info("Fetching all warehouses for owner: {}", ownerId);
        List<Warehouse> warehouses = warehouseRepository.findByOwnerId(ownerId);
        return warehouses.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public WarehouseResponseDTO getWarehouseById(Long warehouseId, Long ownerId) {
        log.info("Fetching warehouse with id: {} for owner: {}", warehouseId, ownerId);
        Warehouse warehouse = warehouseRepository.findByIdAndOwnerId(warehouseId, ownerId)
                .orElseThrow(() -> new RuntimeException(
                    "Warehouse not found with id: " + warehouseId));
        return convertToResponseDTO(warehouse);
    }
    
    public WarehouseResponseDTO createWarehouse(WarehouseRequestDTO requestDTO, Long ownerId) {
        log.info("Creating new warehouse for owner: {}", ownerId);
        
        Warehouse warehouse = convertToEntity(requestDTO);
        warehouse.setOwnerId(ownerId);
        
        Warehouse savedWarehouse = warehouseRepository.save(warehouse);
        log.info("Successfully created warehouse with id: {}", savedWarehouse.getId());
        
        return convertToResponseDTO(savedWarehouse);
    }
    
    public WarehouseResponseDTO updateWarehouse(Long warehouseId, WarehouseRequestDTO requestDTO, Long ownerId) {
        log.info("Updating warehouse with id: {} for owner: {}", warehouseId, ownerId);
        
        Warehouse existingWarehouse = warehouseRepository.findByIdAndOwnerId(warehouseId, ownerId)
                .orElseThrow(() -> new RuntimeException(
                    "Warehouse not found with id: " + warehouseId));
        
        updateEntityFromDTO(requestDTO, existingWarehouse);
        Warehouse updatedWarehouse = warehouseRepository.save(existingWarehouse);
        
        log.info("Successfully updated warehouse with id: {}", warehouseId);
        return convertToResponseDTO(updatedWarehouse);
    }
    
    public void deleteWarehouse(Long warehouseId, Long ownerId) {
        log.info("Deleting warehouse with id: {} for owner: {}", warehouseId, ownerId);
        
        Warehouse warehouse = warehouseRepository.findByIdAndOwnerId(warehouseId, ownerId)
                .orElseThrow(() -> new RuntimeException(
                    "Warehouse not found with id: " + warehouseId));
        
        warehouseRepository.delete(warehouse);
        log.info("Successfully deleted warehouse with id: {}", warehouseId);
    }
    
    public List<WarehouseResponseDTO> searchWarehouses(String searchTerm, Long ownerId) {
        log.info("Searching warehouses with term: {} for owner: {}", searchTerm, ownerId);
        
        List<Warehouse> warehouses = warehouseRepository.searchWarehousesByOwner(ownerId, searchTerm);
        return warehouses.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    // Helper methods for conversion
    private WarehouseResponseDTO convertToResponseDTO(Warehouse warehouse) {
        WarehouseResponseDTO dto = new WarehouseResponseDTO();
        dto.setId(warehouse.getId());
        dto.setName(warehouse.getName());
        dto.setAddress(warehouse.getAddress());
        dto.setCity(warehouse.getCity());
        dto.setStorageType(warehouse.getStorageType());
        dto.setTemperatureMin(warehouse.getTemperatureMin());
        dto.setTemperatureMax(warehouse.getTemperatureMax());
        dto.setTotalSlots(warehouse.getTotalSlots());
        dto.setCapacityPerSlot(warehouse.getCapacityPerSlot());
        dto.setTotalCapacity(warehouse.getTotalCapacity());
        dto.setPricePerKg(warehouse.getPricePerKg());
        dto.setCertifications(warehouse.getCertifications());
        dto.setStatus(warehouse.getStatus());
        dto.setKeeperName(warehouse.getKeeperName());
        dto.setKeeperContact(warehouse.getKeeperContact());
        dto.setKeeperEmail(warehouse.getKeeperEmail());
        dto.setOwnerId(warehouse.getOwnerId());
        dto.setCreatedAt(warehouse.getCreatedAt());
        dto.setUpdatedAt(warehouse.getUpdatedAt());
        return dto;
    }
    
    private Warehouse convertToEntity(WarehouseRequestDTO dto) {
        Warehouse warehouse = new Warehouse();
        warehouse.setName(dto.getName());
        warehouse.setAddress(dto.getAddress());
        warehouse.setCity(dto.getCity());
        warehouse.setStorageType(dto.getStorageType());
        warehouse.setTemperatureMin(dto.getTemperatureMin());
        warehouse.setTemperatureMax(dto.getTemperatureMax());
        warehouse.setTotalSlots(dto.getTotalSlots());
        warehouse.setCapacityPerSlot(dto.getCapacityPerSlot());
        warehouse.setTotalCapacity(dto.getTotalCapacity());
        warehouse.setPricePerKg(dto.getPricePerKg());
        warehouse.setCertifications(dto.getCertifications());
        warehouse.setStatus(dto.getStatus());
        warehouse.setKeeperName(dto.getKeeperName());
        warehouse.setKeeperContact(dto.getKeeperContact());
        warehouse.setKeeperEmail(dto.getKeeperEmail());
        return warehouse;
    }
    
    private void updateEntityFromDTO(WarehouseRequestDTO dto, Warehouse warehouse) {
        warehouse.setName(dto.getName());
        warehouse.setAddress(dto.getAddress());
        warehouse.setCity(dto.getCity());
        warehouse.setStorageType(dto.getStorageType());
        warehouse.setTemperatureMin(dto.getTemperatureMin());
        warehouse.setTemperatureMax(dto.getTemperatureMax());
        warehouse.setTotalSlots(dto.getTotalSlots());
        warehouse.setCapacityPerSlot(dto.getCapacityPerSlot());
        warehouse.setTotalCapacity(dto.getTotalCapacity());
        warehouse.setPricePerKg(dto.getPricePerKg());
        warehouse.setCertifications(dto.getCertifications());
        warehouse.setStatus(dto.getStatus());
        warehouse.setKeeperName(dto.getKeeperName());
        warehouse.setKeeperContact(dto.getKeeperContact());
        warehouse.setKeeperEmail(dto.getKeeperEmail());
    }
}
