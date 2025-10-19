package com.springcloud.service;

import com.springcloud.dto.RouteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransportAnalyticsService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${transport.service.url}")
    private String transportServiceUrl;

    /**
     * Fetch all routes from transport-service for admin analytics
     */
    public List<RouteDTO> fetchAllRoutes() {
        try {
            // Use the configured URL from application.yml
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                transportServiceUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            if (response.getBody() != null) {
                return response.getBody().stream()
                    .map(this::mapToRouteDTO)
                    .collect(Collectors.toList());
            }
            
            return List.of();
        } catch (Exception e) {
            System.err.println("Error fetching routes from transport-service: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    /**
     * Get total route count
     */
    public long getTotalRouteCount() {
        try {
            List<RouteDTO> routes = fetchAllRoutes();
            return routes.size();
        } catch (Exception e) {
            System.err.println("Error getting total route count: " + e.getMessage());
            return 0;
        }
    }

    /**
     * Get routes by location (starting or destination)
     */
    public List<RouteDTO> getRoutesByLocation(String location) {
        try {
            List<RouteDTO> routes = fetchAllRoutes();
            return routes.stream()
                .filter(route -> 
                    (route.getStartingLocation() != null && route.getStartingLocation().toLowerCase().contains(location.toLowerCase())) ||
                    (route.getDestination() != null && route.getDestination().toLowerCase().contains(location.toLowerCase()))
                )
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting routes by location: " + e.getMessage());
            return List.of();
        }
    }

    /**
     * Get total distance of all routes
     */
    public double getTotalDistance() {
        try {
            List<RouteDTO> routes = fetchAllRoutes();
            return routes.stream()
                .mapToDouble(route -> route.getDistance() != null ? route.getDistance() : 0.0)
                .sum();
        } catch (Exception e) {
            System.err.println("Error calculating total distance: " + e.getMessage());
            return 0.0;
        }
    }

    /**
     * Get average distance of routes
     */
    public double getAverageDistance() {
        try {
            List<RouteDTO> routes = fetchAllRoutes();
            if (routes.isEmpty()) {
                return 0.0;
            }
            return routes.stream()
                .mapToDouble(route -> route.getDistance() != null ? route.getDistance() : 0.0)
                .average()
                .orElse(0.0);
        } catch (Exception e) {
            System.err.println("Error calculating average distance: " + e.getMessage());
            return 0.0;
        }
    }

    /**
     * Map raw route data to RouteDTO
     */
    private RouteDTO mapToRouteDTO(Map<String, Object> routeData) {
        RouteDTO dto = new RouteDTO();
        
        try {
            // Map id
            if (routeData.containsKey("id")) {
                Object id = routeData.get("id");
                dto.setId(id != null ? Long.valueOf(id.toString()) : null);
            }
            
            // Map startingLocation
            if (routeData.containsKey("startingLocation")) {
                dto.setStartingLocation((String) routeData.get("startingLocation"));
            }
            
            // Map destination
            if (routeData.containsKey("destination")) {
                dto.setDestination((String) routeData.get("destination"));
            }
            
            // Map distance
            if (routeData.containsKey("distance")) {
                Object distance = routeData.get("distance");
                if (distance != null) {
                    dto.setDistance(Double.valueOf(distance.toString()));
                }
            }
            
            // Map estimatedTime
            if (routeData.containsKey("estimatedTime")) {
                Object time = routeData.get("estimatedTime");
                if (time != null) {
                    dto.setEstimatedTime(Integer.valueOf(time.toString()));
                }
            }
            
            // Map routeDate
            if (routeData.containsKey("routeDate")) {
                Object date = routeData.get("routeDate");
                if (date != null) {
                    if (date instanceof List) {
                        // Handle array format [year, month, day]
                        @SuppressWarnings("unchecked")
                        List<Integer> dateArray = (List<Integer>) date;
                        if (dateArray.size() >= 3) {
                            dto.setRouteDate(LocalDate.of(dateArray.get(0), dateArray.get(1), dateArray.get(2)));
                        }
                    } else if (date instanceof String) {
                        dto.setRouteDate(LocalDate.parse((String) date));
                    }
                }
            }
            
        } catch (Exception e) {
            System.err.println("Error mapping route data: " + e.getMessage());
            e.printStackTrace();
        }
        
        return dto;
    }
}

