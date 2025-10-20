package com.springcloud.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class CityCoordinatesService {
    
    private static final Map<String, double[]> CITY_COORDINATES = new HashMap<>();
    
    static {
        // Major Sri Lankan cities with their coordinates
        // Format: [latitude, longitude]
        CITY_COORDINATES.put("colombo", new double[]{6.9271, 79.8612});
        CITY_COORDINATES.put("kandy", new double[]{7.2906, 80.6337});
        CITY_COORDINATES.put("galle", new double[]{6.0329, 80.2168});
        CITY_COORDINATES.put("jaffna", new double[]{9.6615, 80.0255});
        CITY_COORDINATES.put("negombo", new double[]{7.2083, 79.8358});
        CITY_COORDINATES.put("batticaloa", new double[]{7.7102, 81.6924});
        CITY_COORDINATES.put("matara", new double[]{5.9485, 80.5353});
        CITY_COORDINATES.put("trincomalee", new double[]{8.5874, 81.2152});
        CITY_COORDINATES.put("anuradhapura", new double[]{8.3114, 80.4037});
        CITY_COORDINATES.put("polonnaruwa", new double[]{7.9403, 81.0188});
        CITY_COORDINATES.put("ratnapura", new double[]{6.6828, 80.3992});
        CITY_COORDINATES.put("badulla", new double[]{6.9934, 81.0550});
        CITY_COORDINATES.put("nuwara eliya", new double[]{6.9497, 80.7891});
        CITY_COORDINATES.put("kurunegala", new double[]{7.4818, 80.3609});
        CITY_COORDINATES.put("puttalam", new double[]{8.0362, 79.8283});
        CITY_COORDINATES.put("kalmunai", new double[]{7.4098, 81.8344});
        CITY_COORDINATES.put("vavuniya", new double[]{8.7514, 80.4971});
        CITY_COORDINATES.put("mannar", new double[]{8.9810, 79.9049});
        CITY_COORDINATES.put("hambantota", new double[]{6.1241, 81.1185});
        CITY_COORDINATES.put("chilaw", new double[]{7.5759, 79.7951});
        
        // Add common area/district variations
        CITY_COORDINATES.put("colombo 01", new double[]{6.9344, 79.8428});
        CITY_COORDINATES.put("colombo 02", new double[]{6.9219, 79.8570});
        CITY_COORDINATES.put("colombo 03", new double[]{6.9147, 79.8560});
        CITY_COORDINATES.put("colombo 04", new double[]{6.8935, 79.8538});
        CITY_COORDINATES.put("colombo 05", new double[]{6.8949, 79.8553});
        CITY_COORDINATES.put("colombo 06", new double[]{6.8938, 79.8607});
        CITY_COORDINATES.put("colombo 07", new double[]{6.9271, 79.8612});
        CITY_COORDINATES.put("colombo 08", new double[]{6.9167, 79.8779});
        CITY_COORDINATES.put("colombo 09", new double[]{6.9395, 79.8803});
        CITY_COORDINATES.put("colombo 10", new double[]{6.9549, 79.8729});
        CITY_COORDINATES.put("colombo 11", new double[]{6.9756, 79.8751});
        CITY_COORDINATES.put("colombo 12", new double[]{6.9432, 79.8641});
        CITY_COORDINATES.put("colombo 13", new double[]{6.9756, 79.8910});
        CITY_COORDINATES.put("colombo 14", new double[]{6.9432, 79.8888});
        CITY_COORDINATES.put("colombo 15", new double[]{6.9756, 79.9134});
    }
    
    /**
     * Get coordinates for a given city name
     * @param cityName The name of the city (case-insensitive)
     * @return Array containing [latitude, longitude] or null if not found
     */
    public double[] getCoordinatesForCity(String cityName) {
        if (cityName == null || cityName.trim().isEmpty()) {
            return null;
        }
        
        String normalizedCity = cityName.trim().toLowerCase();
        double[] coordinates = CITY_COORDINATES.get(normalizedCity);
        
        if (coordinates != null) {
            log.debug("Found coordinates for city '{}': [{}, {}]", cityName, coordinates[0], coordinates[1]);
            return coordinates.clone(); // Return a copy to prevent modification
        }
        
        log.debug("No coordinates found for city: {}", cityName);
        return null;
    }
    
    /**
     * Check if coordinates exist for a given city
     */
    public boolean hasCoordinatesForCity(String cityName) {
        return getCoordinatesForCity(cityName) != null;
    }
    
    /**
     * Get latitude for a city
     */
    public Double getLatitudeForCity(String cityName) {
        double[] coords = getCoordinatesForCity(cityName);
        return coords != null ? coords[0] : null;
    }
    
    /**
     * Get longitude for a city
     */
    public Double getLongitudeForCity(String cityName) {
        double[] coords = getCoordinatesForCity(cityName);
        return coords != null ? coords[1] : null;
    }
}