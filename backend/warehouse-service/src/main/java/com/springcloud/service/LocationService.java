package com.springcloud.service;

import com.springcloud.dto.GoogleGeocodeResponse;
import com.springcloud.dto.LocationDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class LocationService {
    
    private final WebClient webClient;
    
    @Value("${google.maps.api-key}")
    private String googleMapsApiKey;
    
    @Value("${google.maps.base-url}")
    private String googleMapsBaseUrl;
    
    public LocationService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    
    /**
     * Geocode an address to get latitude, longitude and formatted address
     */
    public Optional<LocationDTO> geocodeAddress(String address) {
        try {
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
            
            String url = UriComponentsBuilder
                    .fromHttpUrl(googleMapsBaseUrl + "/geocode/json")
                    .queryParam("address", encodedAddress)
                    .queryParam("key", googleMapsApiKey)
                    .toUriString();
            
            log.info("Geocoding address: {} with URL: {}", address, url.replace(googleMapsApiKey, "***"));
            
            GoogleGeocodeResponse response = webClient
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(GoogleGeocodeResponse.class)
                    .block();
            
            if (response != null && "OK".equals(response.getStatus()) && 
                !response.getResults().isEmpty()) {
                
                GoogleGeocodeResponse.GeocodeResult result = response.getResults().get(0);
                LocationDTO locationDTO = new LocationDTO();
                
                // Set basic location data
                locationDTO.setLatitude(result.getGeometry().getLocation().getLat());
                locationDTO.setLongitude(result.getGeometry().getLocation().getLng());
                locationDTO.setFormattedAddress(result.getFormatted_address());
                locationDTO.setPlaceId(result.getPlace_id());
                
                // Parse address components
                parseAddressComponents(result.getAddress_components(), locationDTO);
                
                log.info("Successfully geocoded address: {} -> {}", address, locationDTO);
                return Optional.of(locationDTO);
            } else {
                log.warn("Geocoding failed for address: {}. Status: {}", address, 
                        response != null ? response.getStatus() : "No response");
                return Optional.empty();
            }
            
        } catch (Exception e) {
            log.error("Error geocoding address: {}", address, e);
            return Optional.empty();
        }
    }
    
    /**
     * Reverse geocode coordinates to get address information
     */
    public Optional<LocationDTO> reverseGeocode(Double latitude, Double longitude) {
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl(googleMapsBaseUrl + "/geocode/json")
                    .queryParam("latlng", latitude + "," + longitude)
                    .queryParam("key", googleMapsApiKey)
                    .toUriString();
            
            log.info("Reverse geocoding coordinates: {},{}", latitude, longitude);
            
            GoogleGeocodeResponse response = webClient
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(GoogleGeocodeResponse.class)
                    .block();
            
            if (response != null && "OK".equals(response.getStatus()) && 
                !response.getResults().isEmpty()) {
                
                GoogleGeocodeResponse.GeocodeResult result = response.getResults().get(0);
                LocationDTO locationDTO = new LocationDTO();
                
                locationDTO.setLatitude(latitude);
                locationDTO.setLongitude(longitude);
                locationDTO.setFormattedAddress(result.getFormatted_address());
                locationDTO.setPlaceId(result.getPlace_id());
                
                parseAddressComponents(result.getAddress_components(), locationDTO);
                
                return Optional.of(locationDTO);
            }
            
        } catch (Exception e) {
            log.error("Error reverse geocoding coordinates: {},{}", latitude, longitude, e);
        }
        
        return Optional.empty();
    }
    
    /**
     * Validate if the provided coordinates are within reasonable bounds
     */
    public boolean isValidCoordinates(Double latitude, Double longitude) {
        return latitude != null && longitude != null &&
               latitude >= -90 && latitude <= 90 &&
               longitude >= -180 && longitude <= 180;
    }
    
    /**
     * Parse Google Maps address components into our DTO
     */
    private void parseAddressComponents(List<GoogleGeocodeResponse.AddressComponent> components, 
                                      LocationDTO locationDTO) {
        for (GoogleGeocodeResponse.AddressComponent component : components) {
            List<String> types = component.getTypes();
            
            if (types.contains("street_number")) {
                locationDTO.setStreetNumber(component.getLong_name());
            } else if (types.contains("route")) {
                locationDTO.setStreetName(component.getLong_name());
            } else if (types.contains("locality")) {
                locationDTO.setCity(component.getLong_name());
            } else if (types.contains("administrative_area_level_1")) {
                locationDTO.setState(component.getLong_name());
            } else if (types.contains("country")) {
                locationDTO.setCountry(component.getLong_name());
            } else if (types.contains("postal_code")) {
                locationDTO.setPostalCode(component.getLong_name());
            } else if (types.contains("administrative_area_level_3")) {
                locationDTO.setDistrict(component.getLong_name());
            } else if (types.contains("sublocality")) {
                locationDTO.setSubLocality(component.getLong_name());
            }
        }
    }
}
