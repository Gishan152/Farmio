package com.springcloud.service;

import com.springcloud.dto.FacilityRequestDTO;
import com.springcloud.dto.FacilityResponseDTO;
import com.springcloud.dto.LocationDTO;
import com.springcloud.model.Facility;
import com.springcloud.model.FacilityStatus;
import com.springcloud.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FacilityService {
    
    private final FacilityRepository facilityRepository;
    private final LocationService locationService;
    
    public List<FacilityResponseDTO> getAllFacilitiesByOwner(Long ownerId) {
        log.info("Fetching all facilities for owner: {}", ownerId);
        List<Facility> facilities = facilityRepository.findByOwnerId(ownerId);
        return facilities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public FacilityResponseDTO getFacilityById(Long facilityId, Long ownerId) {
        log.info("Fetching facility: {} for owner: {}", facilityId, ownerId);
        Facility facility = facilityRepository.findByIdAndOwnerId(facilityId, ownerId)
                .orElseThrow(() -> new RuntimeException("Facility not found or access denied"));
        return convertToDTO(facility);
    }
    
    public FacilityResponseDTO createFacility(FacilityRequestDTO requestDTO, Long ownerId) {
        log.info("Creating new facility for owner: {}", ownerId);
        
        // Validate capacity
        if (requestDTO.getAvailableCapacity() > requestDTO.getTotalCapacity()) {
            throw new IllegalArgumentException("Available capacity cannot exceed total capacity");
        }
        
        Facility facility = new Facility();
        updateFacilityFromDTO(facility, requestDTO);
        facility.setOwnerId(ownerId);
        
        // Handle location geocoding
        enrichFacilityWithLocation(facility, requestDTO);
        
        Facility savedFacility = facilityRepository.save(facility);
        log.info("Facility created successfully with ID: {}", savedFacility.getId());
        
        return convertToDTO(savedFacility);
    }
    
    public FacilityResponseDTO updateFacility(Long facilityId, FacilityRequestDTO requestDTO, Long ownerId) {
        log.info("Updating facility: {} for owner: {}", facilityId, ownerId);
        
        Facility facility = facilityRepository.findByIdAndOwnerId(facilityId, ownerId)
                .orElseThrow(() -> new RuntimeException("Facility not found or access denied"));
        
        // Validate capacity
        if (requestDTO.getAvailableCapacity() > requestDTO.getTotalCapacity()) {
            throw new IllegalArgumentException("Available capacity cannot exceed total capacity");
        }
        
        updateFacilityFromDTO(facility, requestDTO);
        
        // Handle location geocoding if address has changed
        enrichFacilityWithLocation(facility, requestDTO);
        
        Facility updatedFacility = facilityRepository.save(facility);
        
        log.info("Facility updated successfully: {}", facilityId);
        return convertToDTO(updatedFacility);
    }
    
    public void deleteFacility(Long facilityId, Long ownerId) {
        log.info("Deleting facility: {} for owner: {}", facilityId, ownerId);
        
        Facility facility = facilityRepository.findByIdAndOwnerId(facilityId, ownerId)
                .orElseThrow(() -> new RuntimeException("Facility not found or access denied"));
        
        facilityRepository.delete(facility);
        log.info("Facility deleted successfully: {}", facilityId);
    }
    
    public List<FacilityResponseDTO> searchFacilities(String searchTerm, Long ownerId) {
        log.info("Searching facilities with term: {} for owner: {}", searchTerm, ownerId);
        List<Facility> facilities = facilityRepository.searchFacilitiesByOwner(ownerId, searchTerm);
        return facilities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<FacilityResponseDTO> getAvailableFacilities() {
        log.info("Fetching available facilities");
        List<Facility> facilities = facilityRepository.findAvailableFacilities();
        return facilities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public FacilityResponseDTO updateFacilityStatus(Long facilityId, FacilityStatus status, Long ownerId) {
        log.info("Updating facility status: {} to {} for owner: {}", facilityId, status, ownerId);
        
        Facility facility = facilityRepository.findByIdAndOwnerId(facilityId, ownerId)
                .orElseThrow(() -> new RuntimeException("Facility not found or access denied"));
        
        facility.setStatus(status);
        Facility updatedFacility = facilityRepository.save(facility);
        
        log.info("Facility status updated successfully: {}", facilityId);
        return convertToDTO(updatedFacility);
    }
    
    /**
     * Geocode an address and return location information
     */
    public Optional<LocationDTO> geocodeAddress(String address) {
        log.info("Geocoding address: {}", address);
        return locationService.geocodeAddress(address);
    }
    
    /**
     * Reverse geocode coordinates to get address information
     */
    public Optional<LocationDTO> reverseGeocode(Double latitude, Double longitude) {
        log.info("Reverse geocoding coordinates: {}, {}", latitude, longitude);
        if (!locationService.isValidCoordinates(latitude, longitude)) {
            throw new IllegalArgumentException("Invalid coordinates provided");
        }
        return locationService.reverseGeocode(latitude, longitude);
    }
    
    private void updateFacilityFromDTO(Facility facility, FacilityRequestDTO dto) {
        facility.setName(dto.getName());
        facility.setType(dto.getType());
        facility.setAddress(dto.getAddress());
        facility.setCity(dto.getCity());
        facility.setState(dto.getState());
        facility.setCountry(dto.getCountry());
        facility.setPostalCode(dto.getPostalCode());
        facility.setContactPerson(dto.getContactPerson());
        facility.setContactPhone(dto.getContactPhone());
        facility.setContactEmail(dto.getContactEmail());
        facility.setTotalCapacity(dto.getTotalCapacity());
        facility.setAvailableCapacity(dto.getAvailableCapacity());
        facility.setTemperatureRange(dto.getTemperatureRange());
        facility.setHumidityRange(dto.getHumidityRange());
        facility.setStatus(dto.getStatus());
        facility.setOperatingHours(dto.getOperatingHours());
        facility.setFacilityFeatures(dto.getFacilityFeatures());
        facility.setCertifications(dto.getCertifications());
        
        // Set provided coordinates if available
        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            facility.setLatitude(dto.getLatitude());
            facility.setLongitude(dto.getLongitude());
        }
        if (dto.getFormattedAddress() != null) {
            facility.setFormattedAddress(dto.getFormattedAddress());
        }
    }
    
    /**
     * Enriches facility with location data using Google Maps API
     */
    private void enrichFacilityWithLocation(Facility facility, FacilityRequestDTO dto) {
        try {
            // If coordinates are not provided, geocode the address
            if ((dto.getLatitude() == null || dto.getLongitude() == null)) {
                String fullAddress = buildFullAddress(dto);
                log.info("Geocoding address for facility: {}", fullAddress);
                
                Optional<LocationDTO> locationOpt = locationService.geocodeAddress(fullAddress);
                if (locationOpt.isPresent()) {
                    LocationDTO location = locationOpt.get();
                    facility.setLatitude(location.getLatitude());
                    facility.setLongitude(location.getLongitude());
                    facility.setFormattedAddress(location.getFormattedAddress());
                    
                    // Update address components with more precise data from Google Maps
                    if (location.getCity() != null && !location.getCity().isEmpty()) {
                        facility.setCity(location.getCity());
                    }
                    if (location.getState() != null && !location.getState().isEmpty()) {
                        facility.setState(location.getState());
                    }
                    if (location.getCountry() != null && !location.getCountry().isEmpty()) {
                        facility.setCountry(location.getCountry());
                    }
                    if (location.getPostalCode() != null && !location.getPostalCode().isEmpty()) {
                        facility.setPostalCode(location.getPostalCode());
                    }
                    
                    log.info("Successfully geocoded facility location: lat={}, lng={}", 
                            location.getLatitude(), location.getLongitude());
                } else {
                    log.warn("Could not geocode address for facility: {}", fullAddress);
                }
            }
            // If coordinates are provided, validate them and optionally reverse geocode
            else if (locationService.isValidCoordinates(dto.getLatitude(), dto.getLongitude())) {
                facility.setLatitude(dto.getLatitude());
                facility.setLongitude(dto.getLongitude());
                
                // Optionally reverse geocode to get formatted address if not provided
                if (dto.getFormattedAddress() == null || dto.getFormattedAddress().isEmpty()) {
                    Optional<LocationDTO> locationOpt = locationService.reverseGeocode(
                            dto.getLatitude(), dto.getLongitude());
                    locationOpt.ifPresent(location -> 
                            facility.setFormattedAddress(location.getFormattedAddress()));
                }
                
                log.info("Using provided coordinates for facility: lat={}, lng={}", 
                        dto.getLatitude(), dto.getLongitude());
            } else {
                log.warn("Invalid coordinates provided for facility: lat={}, lng={}", 
                        dto.getLatitude(), dto.getLongitude());
            }
        } catch (Exception e) {
            log.error("Error enriching facility with location data", e);
            // Don't fail the entire operation if geocoding fails
        }
    }
    
    /**
     * Builds a full address string for geocoding
     */
    private String buildFullAddress(FacilityRequestDTO dto) {
        StringBuilder address = new StringBuilder();
        
        if (dto.getAddress() != null && !dto.getAddress().trim().isEmpty()) {
            address.append(dto.getAddress().trim());
        }
        
        if (dto.getCity() != null && !dto.getCity().trim().isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(dto.getCity().trim());
        }
        
        if (dto.getState() != null && !dto.getState().trim().isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(dto.getState().trim());
        }
        
        if (dto.getCountry() != null && !dto.getCountry().trim().isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(dto.getCountry().trim());
        }
        
        if (dto.getPostalCode() != null && !dto.getPostalCode().trim().isEmpty()) {
            if (address.length() > 0) address.append(" ");
            address.append(dto.getPostalCode().trim());
        }
        
        return address.toString();
    }
    
    private FacilityResponseDTO convertToDTO(Facility facility) {
        FacilityResponseDTO dto = new FacilityResponseDTO();
        dto.setId(facility.getId());
        dto.setName(facility.getName());
        dto.setType(facility.getType());
        dto.setAddress(facility.getAddress());
        dto.setCity(facility.getCity());
        dto.setState(facility.getState());
        dto.setCountry(facility.getCountry());
        dto.setPostalCode(facility.getPostalCode());
        dto.setLatitude(facility.getLatitude());
        dto.setLongitude(facility.getLongitude());
        dto.setFormattedAddress(facility.getFormattedAddress());
        dto.setContactPerson(facility.getContactPerson());
        dto.setContactPhone(facility.getContactPhone());
        dto.setContactEmail(facility.getContactEmail());
        dto.setTotalCapacity(facility.getTotalCapacity());
        dto.setAvailableCapacity(facility.getAvailableCapacity());
        dto.setTemperatureRange(facility.getTemperatureRange());
        dto.setHumidityRange(facility.getHumidityRange());
        dto.setStatus(facility.getStatus());
        dto.setOperatingHours(facility.getOperatingHours());
        dto.setFacilityFeatures(facility.getFacilityFeatures());
        dto.setCertifications(facility.getCertifications());
        dto.setOwnerId(facility.getOwnerId());
        dto.setCreatedAt(facility.getCreatedAt());
        dto.setUpdatedAt(facility.getUpdatedAt());
        return dto;
    }
} 