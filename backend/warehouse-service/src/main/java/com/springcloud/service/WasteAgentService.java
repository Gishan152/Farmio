package com.springcloud.service;

import com.springcloud.dto.WasteAgentRequestDTO;
import com.springcloud.dto.WasteAgentResponseDTO;
import com.springcloud.model.WasteAgent;
import com.springcloud.repository.WasteAgentRepository;
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
public class WasteAgentService {
    
    private final WasteAgentRepository wasteAgentRepository;
    
    /**
     * Get all waste agents
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getAllWasteAgents() {
        log.info("Fetching all waste agents");
        List<WasteAgent> wasteAgents = wasteAgentRepository.findAll();
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all active waste agents
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getActiveWasteAgents() {
        log.info("Fetching all active waste agents");
        List<WasteAgent> wasteAgents = wasteAgentRepository.findByIsActiveTrue();
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all verified waste agents
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getVerifiedWasteAgents() {
        log.info("Fetching all verified waste agents");
        List<WasteAgent> wasteAgents = wasteAgentRepository.findByIsVerifiedTrue();
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all active and verified waste agents
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getActiveAndVerifiedWasteAgents() {
        log.info("Fetching all active and verified waste agents");
        List<WasteAgent> wasteAgents = wasteAgentRepository.findByIsActiveTrueAndIsVerifiedTrue();
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get waste agent by ID
     */
    @Transactional(readOnly = true)
    public Optional<WasteAgentResponseDTO> getWasteAgentById(Long id) {
        log.info("Fetching waste agent with id: {}", id);
        return wasteAgentRepository.findById(id)
                .map(this::convertToResponseDTO);
    }
    
    /**
     * Get waste agents by city
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getWasteAgentsByCity(String city) {
        log.info("Fetching waste agents for city: {}", city);
        List<WasteAgent> wasteAgents = wasteAgentRepository.findByCity(city);
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get waste agents by specialization
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getWasteAgentsBySpecialization(String specialization) {
        log.info("Fetching waste agents with specialization: {}", specialization);
        List<WasteAgent> wasteAgents = wasteAgentRepository.findBySpecialization(specialization);
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get waste agents by city and specialization
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getWasteAgentsByCityAndSpecialization(String city, String specialization) {
        log.info("Fetching waste agents for city: {} with specialization: {}", city, specialization);
        List<WasteAgent> wasteAgents = wasteAgentRepository.findByCityAndSpecialization(city, specialization);
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Search waste agents
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> searchWasteAgents(String searchTerm) {
        log.info("Searching waste agents with term: {}", searchTerm);
        List<WasteAgent> wasteAgents = wasteAgentRepository.searchActiveWasteAgents(searchTerm);
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get waste agents serving a specific city
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getWasteAgentsServingCity(String city) {
        log.info("Fetching waste agents serving city: {}", city);
        List<WasteAgent> wasteAgents = wasteAgentRepository.findWasteAgentsServingCity(city);
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get top rated waste agents
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getTopRatedWasteAgents() {
        log.info("Fetching top rated waste agents");
        List<WasteAgent> wasteAgents = wasteAgentRepository.findTopRatedWasteAgents();
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get waste agents with minimum rating
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getWasteAgentsWithMinRating(Double minRating) {
        log.info("Fetching waste agents with minimum rating: {}", minRating);
        List<WasteAgent> wasteAgents = wasteAgentRepository.findByIsActiveTrueAndIsVerifiedTrueAndRatingGreaterThanEqual(minRating);
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get waste agents by multiple cities
     */
    @Transactional(readOnly = true)
    public List<WasteAgentResponseDTO> getWasteAgentsByMultipleCities(List<String> cities) {
        log.info("Fetching waste agents for cities: {}", cities);
        List<WasteAgent> wasteAgents = wasteAgentRepository.findByIsActiveTrueAndCityIn(cities);
        return wasteAgents.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Count active waste agents by city
     */
    @Transactional(readOnly = true)
    public Long countActiveWasteAgentsByCity(String city) {
        log.info("Counting active waste agents for city: {}", city);
        return wasteAgentRepository.countActiveWasteAgentsByCity(city);
    }
    
    /**
     * Create a new waste agent
     */
    @Transactional
    public WasteAgentResponseDTO createWasteAgent(WasteAgentRequestDTO requestDTO) {
        log.info("Creating new waste agent: {}", requestDTO.getName());
        
        // Check if email already exists
        if (wasteAgentRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Waste agent with email " + requestDTO.getEmail() + " already exists");
        }
        
        // Check if license number already exists (if provided)
        if (requestDTO.getLicenseNumber() != null && 
            wasteAgentRepository.findByLicenseNumber(requestDTO.getLicenseNumber()).isPresent()) {
            throw new RuntimeException("Waste agent with license number " + requestDTO.getLicenseNumber() + " already exists");
        }
        
        WasteAgent wasteAgent = convertToEntity(requestDTO);
        WasteAgent savedWasteAgent = wasteAgentRepository.save(wasteAgent);
        log.info("Waste agent created successfully with id: {}", savedWasteAgent.getId());
        
        return convertToResponseDTO(savedWasteAgent);
    }
    
    /**
     * Update existing waste agent
     */
    @Transactional
    public WasteAgentResponseDTO updateWasteAgent(Long id, WasteAgentRequestDTO requestDTO) {
        log.info("Updating waste agent with id: {}", id);
        
        WasteAgent existingWasteAgent = wasteAgentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Waste agent not found with id: " + id));
        
        // Check if email is being changed and if new email already exists
        if (!existingWasteAgent.getEmail().equals(requestDTO.getEmail()) &&
            wasteAgentRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Waste agent with email " + requestDTO.getEmail() + " already exists");
        }
        
        // Update fields
        updateEntityFromDTO(existingWasteAgent, requestDTO);
        WasteAgent updatedWasteAgent = wasteAgentRepository.save(existingWasteAgent);
        log.info("Waste agent updated successfully with id: {}", updatedWasteAgent.getId());
        
        return convertToResponseDTO(updatedWasteAgent);
    }
    
    /**
     * Delete waste agent (soft delete by setting isActive to false)
     */
    @Transactional
    public void deleteWasteAgent(Long id) {
        log.info("Deleting waste agent with id: {}", id);
        
        WasteAgent wasteAgent = wasteAgentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Waste agent not found with id: " + id));
        
        wasteAgent.setIsActive(false);
        wasteAgentRepository.save(wasteAgent);
        log.info("Waste agent soft deleted successfully with id: {}", id);
    }
    
    /**
     * Convert entity to response DTO
     */
    private WasteAgentResponseDTO convertToResponseDTO(WasteAgent wasteAgent) {
        return WasteAgentResponseDTO.builder()
                .id(wasteAgent.getId())
                .name(wasteAgent.getName())
                .email(wasteAgent.getEmail())
                .phoneNumber(wasteAgent.getPhoneNumber())
                .address(wasteAgent.getAddress())
                .city(wasteAgent.getCity())
                .state(wasteAgent.getState())
                .postalCode(wasteAgent.getPostalCode())
                .licenseNumber(wasteAgent.getLicenseNumber())
                .companyName(wasteAgent.getCompanyName())
                .specialization(wasteAgent.getSpecialization())
                .serviceRadius(wasteAgent.getServiceRadius())
                .rating(wasteAgent.getRating())
                .totalReviews(wasteAgent.getTotalReviews())
                .isActive(wasteAgent.getIsActive())
                .isVerified(wasteAgent.getIsVerified())
                .createdAt(wasteAgent.getCreatedAt())
                .updatedAt(wasteAgent.getUpdatedAt())
                .build();
    }
    
    /**
     * Convert request DTO to entity
     */
    private WasteAgent convertToEntity(WasteAgentRequestDTO requestDTO) {
        WasteAgent wasteAgent = new WasteAgent();
        wasteAgent.setName(requestDTO.getName());
        wasteAgent.setEmail(requestDTO.getEmail());
        wasteAgent.setPhoneNumber(requestDTO.getPhoneNumber());
        wasteAgent.setAddress(requestDTO.getAddress());
        wasteAgent.setCity(requestDTO.getCity());
        wasteAgent.setState(requestDTO.getState());
        wasteAgent.setPostalCode(requestDTO.getPostalCode());
        wasteAgent.setLicenseNumber(requestDTO.getLicenseNumber());
        wasteAgent.setCompanyName(requestDTO.getCompanyName());
        wasteAgent.setSpecialization(requestDTO.getSpecialization());
        wasteAgent.setServiceRadius(requestDTO.getServiceRadius());
        wasteAgent.setIsActive(requestDTO.getIsActive());
        wasteAgent.setIsVerified(requestDTO.getIsVerified());
        return wasteAgent;
    }
    
    /**
     * Update entity from request DTO
     */
    private void updateEntityFromDTO(WasteAgent wasteAgent, WasteAgentRequestDTO requestDTO) {
        wasteAgent.setName(requestDTO.getName());
        wasteAgent.setEmail(requestDTO.getEmail());
        wasteAgent.setPhoneNumber(requestDTO.getPhoneNumber());
        wasteAgent.setAddress(requestDTO.getAddress());
        wasteAgent.setCity(requestDTO.getCity());
        wasteAgent.setState(requestDTO.getState());
        wasteAgent.setPostalCode(requestDTO.getPostalCode());
        wasteAgent.setLicenseNumber(requestDTO.getLicenseNumber());
        wasteAgent.setCompanyName(requestDTO.getCompanyName());
        wasteAgent.setSpecialization(requestDTO.getSpecialization());
        wasteAgent.setServiceRadius(requestDTO.getServiceRadius());
        wasteAgent.setIsActive(requestDTO.getIsActive());
        wasteAgent.setIsVerified(requestDTO.getIsVerified());
    }
}