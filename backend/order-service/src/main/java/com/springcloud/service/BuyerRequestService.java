package com.springcloud.service;

import com.springcloud.model.BuyerRequest;
import com.springcloud.dto.BuyerRequestDto;
import com.springcloud.repository.BuyerRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;



@Service
public class BuyerRequestService {
    @Autowired
    private BuyerRequestRepository repository;

    public List<BuyerRequestDto> getRequestsByUserId(Long userId) {
        return repository.findByUserId(userId).stream().map(this::toDto).collect(java.util.stream.Collectors.toList());
    }

    public List<BuyerRequestDto> getAllRequests() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<BuyerRequestDto> getRequestById(Long id) {
        return repository.findById(id).map(this::toDto);
    }

    public BuyerRequestDto createRequest(BuyerRequestDto dto, Long userId, String rolesCsv) {
        if (!rolesCsv.contains("ROLE_BUYER")) {
            throw new RuntimeException("Only buyers can create requests");
        }
        dto.setUserId(userId);
        System.out.println("Dto : " + dto);
        BuyerRequest entity = toEntity(dto);
        BuyerRequest saved = repository.save(entity);
        return toDto(saved);
    }

    public Optional<BuyerRequestDto> updateRequest(Long id, BuyerRequestDto dto, Long userId, String rolesCsv) {
        return repository.findById(id).map(existing -> {
            if (!existing.getUserId().equals(userId)) {
                throw new RuntimeException("You can only update your own requests");
            }
            existing.setCrop(dto.getCrop());
            existing.setUnitMeasurement(dto.getUnitMeasurement());
            existing.setQuantity(dto.getQuantity());
            existing.setQuality(dto.getQuality());
            existing.setPriceMin(dto.getPriceMin());
            existing.setPriceMax(dto.getPriceMax());
            existing.setLocation(dto.getLocation());
            existing.setDeadline(dto.getDeadline());
            existing.setNotes(dto.getNotes());
            existing.setVisibility(dto.getVisibility());
            existing.setDate(dto.getDate());
            BuyerRequest updated = repository.save(existing);
            return toDto(updated);
        });
    }

    public void deleteRequest(Long id, Long userId, String rolesCsv) {
        repository.findById(id).ifPresent(existing -> {
            if (!existing.getUserId().equals(userId)) {
                throw new RuntimeException("You can only delete your own requests");
            }
            repository.deleteById(id);
        });
    }

    private BuyerRequestDto toDto(BuyerRequest entity) {
        BuyerRequestDto dto = new BuyerRequestDto();
        dto.setId(entity.getId());
        dto.setCrop(entity.getCrop());
        dto.setUnitMeasurement(entity.getUnitMeasurement());
        dto.setQuantity(entity.getQuantity());
        dto.setQuality(entity.getQuality());
        dto.setPriceMin(entity.getPriceMin());
        dto.setPriceMax(entity.getPriceMax());
        dto.setLocation(entity.getLocation());
        dto.setDeadline(entity.getDeadline());
        dto.setNotes(entity.getNotes());
        dto.setVisibility(entity.getVisibility());
        dto.setDate(entity.getDate());
        dto.setUserId(entity.getUserId());
        return dto;
    }

    private BuyerRequest toEntity(BuyerRequestDto dto) {
        BuyerRequest entity = new BuyerRequest();
        entity.setId(dto.getId());
        entity.setCrop(dto.getCrop());
        entity.setUnitMeasurement(dto.getUnitMeasurement());
        entity.setQuantity(dto.getQuantity());
        entity.setQuality(dto.getQuality());
        entity.setPriceMin(dto.getPriceMin());
        entity.setPriceMax(dto.getPriceMax());
        entity.setLocation(dto.getLocation());
        entity.setDeadline(dto.getDeadline());
        entity.setNotes(dto.getNotes());
        entity.setVisibility(dto.getVisibility());
        entity.setDate(dto.getDate());
        entity.setUserId(dto.getUserId());
        return entity;
    }
}
