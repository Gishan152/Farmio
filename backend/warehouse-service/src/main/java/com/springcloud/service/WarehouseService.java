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
        return warehouseRepository.findByOwnerId(ownerId)
                .stream().map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public WarehouseResponseDTO getWarehouseById(Long warehouseId, Long ownerId) {
        Warehouse w = warehouseRepository.findByIdAndOwnerId(warehouseId, ownerId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));
        return convertToResponseDTO(w);
    }

    public WarehouseResponseDTO createWarehouse(WarehouseRequestDTO dto, Long ownerId) {
        log.info("Creating warehouse for owner: {}", ownerId);
        Warehouse w = convertToEntity(dto);
        w.setOwnerId(ownerId);
        w.setTotalCapacity(dto.getTotalSlots() * dto.getCapacityPerSlot()); // auto-compute
        Warehouse saved = warehouseRepository.save(w);
        log.info("Warehouse created with id: {}", saved.getId());
        return convertToResponseDTO(saved);
    }

    public WarehouseResponseDTO updateWarehouse(Long warehouseId, WarehouseRequestDTO dto, Long ownerId) {
        Warehouse w = warehouseRepository.findByIdAndOwnerId(warehouseId, ownerId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));
        updateEntityFromDTO(w, dto);
        w.setTotalCapacity(dto.getTotalSlots() * dto.getCapacityPerSlot());
        Warehouse updated = warehouseRepository.save(w);
        log.info("Updated warehouse: {}", warehouseId);
        return convertToResponseDTO(updated);
    }

    public void deleteWarehouse(Long warehouseId, Long ownerId) {
        Warehouse w = warehouseRepository.findByIdAndOwnerId(warehouseId, ownerId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));
        warehouseRepository.delete(w);
        log.info("Deleted warehouse: {}", warehouseId);
    }

    public List<WarehouseResponseDTO> searchWarehouses(String searchTerm, Long ownerId) {
        return warehouseRepository.searchWarehousesByOwner(ownerId, searchTerm)
                .stream().map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /* ---------- helpers ---------- */
    private WarehouseResponseDTO convertToResponseDTO(Warehouse w) {
        WarehouseResponseDTO dto = new WarehouseResponseDTO();
        dto.setId(w.getId());
        dto.setName(w.getName());
        dto.setAddress(w.getAddress());
        dto.setCity(w.getCity());
        dto.setStorageType(w.getStorageType());
        dto.setTemperatureMin(w.getTemperatureMin());
        dto.setTemperatureMax(w.getTemperatureMax());
        dto.setTotalSlots(w.getTotalSlots());
        dto.setCapacityPerSlot(w.getCapacityPerSlot());
        dto.setTotalCapacity(w.getTotalCapacity());
        dto.setPricePerKg(w.getPricePerKg());
        dto.setCertifications(w.getCertifications());
        dto.setStatus(w.getStatus());
        dto.setKeeperName(w.getKeeperName());
        dto.setKeeperContact(w.getKeeperContact());
        dto.setKeeperEmail(w.getKeeperEmail());
        dto.setOwnerId(w.getOwnerId());
        dto.setCreatedAt(w.getCreatedAt());
        dto.setUpdatedAt(w.getUpdatedAt());
        return dto;
    }

    private Warehouse convertToEntity(WarehouseRequestDTO dto) {
        Warehouse w = new Warehouse();
        w.setName(dto.getName());
        w.setAddress(dto.getAddress());
        w.setCity(dto.getCity());
        w.setStorageType(dto.getStorageType());
        w.setTemperatureMin(dto.getTemperatureMin());
        w.setTemperatureMax(dto.getTemperatureMax());
        w.setTotalSlots(dto.getTotalSlots());
        w.setCapacityPerSlot(dto.getCapacityPerSlot());
        w.setPricePerKg(dto.getPricePerKg());
        w.setCertifications(dto.getCertifications());
        w.setStatus(dto.getStatus());
        w.setKeeperName(dto.getKeeperName());
        w.setKeeperContact(dto.getKeeperContact());
        w.setKeeperEmail(dto.getKeeperEmail());
        return w;
        }

        private void updateEntityFromDTO(Warehouse w, WarehouseRequestDTO dto) {
            w.setName(dto.getName());
            w.setAddress(dto.getAddress());
            w.setCity(dto.getCity());
            w.setStorageType(dto.getStorageType());
            w.setTemperatureMin(dto.getTemperatureMin());
            w.setTemperatureMax(dto.getTemperatureMax());
            w.setTotalSlots(dto.getTotalSlots());
            w.setCapacityPerSlot(dto.getCapacityPerSlot());
            w.setPricePerKg(dto.getPricePerKg());
            w.setCertifications(dto.getCertifications());
            w.setStatus(dto.getStatus());
            w.setKeeperName(dto.getKeeperName());
            w.setKeeperContact(dto.getKeeperContact());
            w.setKeeperEmail(dto.getKeeperEmail());
        }
    }