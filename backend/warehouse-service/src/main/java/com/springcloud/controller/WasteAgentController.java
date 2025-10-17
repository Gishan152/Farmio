package com.springcloud.controller;

import com.springcloud.dto.WasteAgentRequestDTO;
import com.springcloud.dto.WasteAgentResponseDTO;
import com.springcloud.service.WasteAgentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/waste-agents")
@RequiredArgsConstructor
@Slf4j
public class WasteAgentController {
    
    private final WasteAgentService wasteAgentService;
    
    /**
     * Get all waste agents
     */
    @GetMapping
    public ResponseEntity<List<WasteAgentResponseDTO>> getAllWasteAgents(
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) List<String> cities) {
        
        log.info("Received request to get waste agents with filter: {}, search: {}, city: {}, specialization: {}, minRating: {}, cities: {}", 
                filter, search, city, specialization, minRating, cities);
        
        try {
            List<WasteAgentResponseDTO> wasteAgents;
            
            // Handle search functionality
            if (search != null && !search.trim().isEmpty()) {
                wasteAgents = wasteAgentService.searchWasteAgents(search);
            }
            // Handle multiple cities filter
            else if (cities != null && !cities.isEmpty()) {
                wasteAgents = wasteAgentService.getWasteAgentsByMultipleCities(cities);
            }
            // Handle city and specialization filter
            else if (city != null && specialization != null) {
                wasteAgents = wasteAgentService.getWasteAgentsByCityAndSpecialization(city, specialization);
            }
            // Handle city filter
            else if (city != null) {
                wasteAgents = wasteAgentService.getWasteAgentsByCity(city);
            }
            // Handle specialization filter
            else if (specialization != null) {
                wasteAgents = wasteAgentService.getWasteAgentsBySpecialization(specialization);
            }
            // Handle minimum rating filter
            else if (minRating != null) {
                wasteAgents = wasteAgentService.getWasteAgentsWithMinRating(minRating);
            }
            // Handle filter parameter
            else if (filter != null) {
                switch (filter.toLowerCase()) {
                    case "active":
                        wasteAgents = wasteAgentService.getActiveWasteAgents();
                        break;
                    case "verified":
                        wasteAgents = wasteAgentService.getVerifiedWasteAgents();
                        break;
                    case "active-verified":
                        wasteAgents = wasteAgentService.getActiveAndVerifiedWasteAgents();
                        break;
                    case "top-rated":
                        wasteAgents = wasteAgentService.getTopRatedWasteAgents();
                        break;
                    default:
                        wasteAgents = wasteAgentService.getAllWasteAgents();
                }
            }
            // Default: get all waste agents
            else {
                wasteAgents = wasteAgentService.getAllWasteAgents();
            }
            
            log.info("Successfully retrieved {} waste agents", wasteAgents.size());
            return ResponseEntity.ok(wasteAgents);
            
        } catch (Exception e) {
            log.error("Error retrieving waste agents: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get waste agent by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<WasteAgentResponseDTO> getWasteAgentById(@PathVariable Long id) {
        log.info("Received request to get waste agent with id: {}", id);
        
        try {
            Optional<WasteAgentResponseDTO> wasteAgent = wasteAgentService.getWasteAgentById(id);
            
            if (wasteAgent.isPresent()) {
                log.info("Successfully retrieved waste agent with id: {}", id);
                return ResponseEntity.ok(wasteAgent.get());
            } else {
                log.warn("Waste agent not found with id: {}", id);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("Error retrieving waste agent with id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get waste agents serving a specific city
     */
    @GetMapping("/serving-city/{city}")
    public ResponseEntity<List<WasteAgentResponseDTO>> getWasteAgentsServingCity(@PathVariable String city) {
        log.info("Received request to get waste agents serving city: {}", city);
        
        try {
            List<WasteAgentResponseDTO> wasteAgents = wasteAgentService.getWasteAgentsServingCity(city);
            log.info("Successfully retrieved {} waste agents serving city: {}", wasteAgents.size(), city);
            return ResponseEntity.ok(wasteAgents);
            
        } catch (Exception e) {
            log.error("Error retrieving waste agents serving city {}: {}", city, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Count active waste agents by city
     */
    @GetMapping("/count/city/{city}")
    public ResponseEntity<Long> countActiveWasteAgentsByCity(@PathVariable String city) {
        log.info("Received request to count active waste agents for city: {}", city);
        
        try {
            Long count = wasteAgentService.countActiveWasteAgentsByCity(city);
            log.info("Successfully counted {} active waste agents for city: {}", count, city);
            return ResponseEntity.ok(count);
            
        } catch (Exception e) {
            log.error("Error counting waste agents for city {}: {}", city, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Create a new waste agent
     */
    @PostMapping
    public ResponseEntity<WasteAgentResponseDTO> createWasteAgent(@Valid @RequestBody WasteAgentRequestDTO requestDTO) {
        log.info("Received request to create waste agent: {}", requestDTO.getName());
        
        try {
            WasteAgentResponseDTO createdWasteAgent = wasteAgentService.createWasteAgent(requestDTO);
            log.info("Successfully created waste agent with id: {}", createdWasteAgent.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdWasteAgent);
            
        } catch (RuntimeException e) {
            log.error("Error creating waste agent: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            
        } catch (Exception e) {
            log.error("Unexpected error creating waste agent: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Update existing waste agent
     */
    @PutMapping("/{id}")
    public ResponseEntity<WasteAgentResponseDTO> updateWasteAgent(
            @PathVariable Long id, 
            @Valid @RequestBody WasteAgentRequestDTO requestDTO) {
        
        log.info("Received request to update waste agent with id: {}", id);
        
        try {
            WasteAgentResponseDTO updatedWasteAgent = wasteAgentService.updateWasteAgent(id, requestDTO);
            log.info("Successfully updated waste agent with id: {}", id);
            return ResponseEntity.ok(updatedWasteAgent);
            
        } catch (RuntimeException e) {
            log.error("Error updating waste agent with id {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            
        } catch (Exception e) {
            log.error("Unexpected error updating waste agent with id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Delete waste agent (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWasteAgent(@PathVariable Long id) {
        log.info("Received request to delete waste agent with id: {}", id);
        
        try {
            wasteAgentService.deleteWasteAgent(id);
            log.info("Successfully deleted waste agent with id: {}", id);
            return ResponseEntity.noContent().build();
            
        } catch (RuntimeException e) {
            log.error("Error deleting waste agent with id {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("Unexpected error deleting waste agent with id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Activate waste agent
     */
    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activateWasteAgent(@PathVariable Long id) {
        log.info("Received request to activate waste agent with id: {}", id);
        
        try {
            Optional<WasteAgentResponseDTO> wasteAgent = wasteAgentService.getWasteAgentById(id);
            if (wasteAgent.isPresent()) {
                WasteAgentRequestDTO updateDto = new WasteAgentRequestDTO();
                WasteAgentResponseDTO current = wasteAgent.get();
                
                // Copy all current values
                updateDto.setName(current.getName());
                updateDto.setEmail(current.getEmail());
                updateDto.setPhoneNumber(current.getPhoneNumber());
                updateDto.setAddress(current.getAddress());
                updateDto.setCity(current.getCity());
                updateDto.setState(current.getState());
                updateDto.setPostalCode(current.getPostalCode());
                updateDto.setLicenseNumber(current.getLicenseNumber());
                updateDto.setCompanyName(current.getCompanyName());
                updateDto.setSpecialization(current.getSpecialization());
                updateDto.setServiceRadius(current.getServiceRadius());
                updateDto.setIsActive(true); // Activate
                updateDto.setIsVerified(current.getIsVerified());
                
                wasteAgentService.updateWasteAgent(id, updateDto);
                log.info("Successfully activated waste agent with id: {}", id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("Error activating waste agent with id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Verify waste agent
     */
    @PatchMapping("/{id}/verify")
    public ResponseEntity<Void> verifyWasteAgent(@PathVariable Long id) {
        log.info("Received request to verify waste agent with id: {}", id);
        
        try {
            Optional<WasteAgentResponseDTO> wasteAgent = wasteAgentService.getWasteAgentById(id);
            if (wasteAgent.isPresent()) {
                WasteAgentRequestDTO updateDto = new WasteAgentRequestDTO();
                WasteAgentResponseDTO current = wasteAgent.get();
                
                // Copy all current values
                updateDto.setName(current.getName());
                updateDto.setEmail(current.getEmail());
                updateDto.setPhoneNumber(current.getPhoneNumber());
                updateDto.setAddress(current.getAddress());
                updateDto.setCity(current.getCity());
                updateDto.setState(current.getState());
                updateDto.setPostalCode(current.getPostalCode());
                updateDto.setLicenseNumber(current.getLicenseNumber());
                updateDto.setCompanyName(current.getCompanyName());
                updateDto.setSpecialization(current.getSpecialization());
                updateDto.setServiceRadius(current.getServiceRadius());
                updateDto.setIsActive(current.getIsActive());
                updateDto.setIsVerified(true); // Verify
                
                wasteAgentService.updateWasteAgent(id, updateDto);
                log.info("Successfully verified waste agent with id: {}", id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("Error verifying waste agent with id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}