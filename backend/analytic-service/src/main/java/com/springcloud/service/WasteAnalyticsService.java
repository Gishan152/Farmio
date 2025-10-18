package com.springcloud.service;

import com.springcloud.dto.WasteListingDTO;
import com.springcloud.dto.WasteAgentDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WasteAnalyticsService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${waste.service.url.listings}")
    private String wasteListingsUrl;
    
    @Value("${waste.service.url.agents}")
    private String wasteAgentsUrl;

    /**
     * Fetch all waste listings from waste-service for admin analytics
     */
    public List<WasteListingDTO> fetchAllWasteListings() {
        try {
            ResponseEntity<List<WasteListingDTO>> response = restTemplate.exchange(
                wasteListingsUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<WasteListingDTO>>() {}
            );

            if (response.getBody() != null) {
                return response.getBody();
            }
            
            return List.of();
        } catch (Exception e) {
            System.err.println("Error fetching waste listings from waste-service: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }
    
    /**
     * Fetch all waste agents from waste-service for admin analytics
     */
    public List<WasteAgentDTO> fetchAllWasteAgents() {
        try {
            ResponseEntity<List<WasteAgentDTO>> response = restTemplate.exchange(
                wasteAgentsUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<WasteAgentDTO>>() {}
            );

            if (response.getBody() != null) {
                return response.getBody();
            }
            
            return List.of();
        } catch (Exception e) {
            System.err.println("Error fetching waste agents from waste-service: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }
    
    /**
     * Get waste listings count by status
     */
    public Map<String, Long> getWasteListingCountByStatus() {
        try {
            List<WasteListingDTO> listings = fetchAllWasteListings();
            
            Map<String, Long> statusCounts = new HashMap<>();
            
            for (WasteListingDTO listing : listings) {
                String status = listing.getStatus();
                if (status != null) {
                    statusCounts.put(status, statusCounts.getOrDefault(status, 0L) + 1);
                }
            }
            
            return statusCounts;
        } catch (Exception e) {
            System.err.println("Error getting waste listing count by status: " + e.getMessage());
            return Map.of();
        }
    }
    
    /**
     * Get waste listings by status
     */
    public List<WasteListingDTO> getWasteListingsByStatus(String status) {
        try {
            List<WasteListingDTO> listings = fetchAllWasteListings();
            
            return listings.stream()
                .filter(listing -> status.equals(listing.getStatus()))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting waste listings by status: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Get waste listings by waste type
     */
    public List<WasteListingDTO> getWasteListingsByType(String wasteType) {
        try {
            List<WasteListingDTO> listings = fetchAllWasteListings();
            
            return listings.stream()
                .filter(listing -> wasteType.equals(listing.getWasteType()))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting waste listings by type: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Get waste listings count by waste type
     */
    public Map<String, Long> getWasteListingCountByType() {
        try {
            List<WasteListingDTO> listings = fetchAllWasteListings();
            
            Map<String, Long> typeCounts = new HashMap<>();
            
            for (WasteListingDTO listing : listings) {
                String wasteType = listing.getWasteType();
                if (wasteType != null) {
                    typeCounts.put(wasteType, typeCounts.getOrDefault(wasteType, 0L) + 1);
                }
            }
            
            return typeCounts;
        } catch (Exception e) {
            System.err.println("Error getting waste listing count by type: " + e.getMessage());
            return Map.of();
        }
    }
    
    /**
     * Get total waste listing count
     */
    public long getTotalWasteListingCount() {
        try {
            return fetchAllWasteListings().size();
        } catch (Exception e) {
            System.err.println("Error getting total waste listing count: " + e.getMessage());
            return 0;
        }
    }
    
    /**
     * Get total waste agent count
     */
    public long getTotalWasteAgentCount() {
        try {
            return fetchAllWasteAgents().size();
        } catch (Exception e) {
            System.err.println("Error getting total waste agent count: " + e.getMessage());
            return 0;
        }
    }
}