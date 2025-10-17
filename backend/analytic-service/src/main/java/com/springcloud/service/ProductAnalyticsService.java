package com.springcloud.service;

import com.springcloud.dto.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductAnalyticsService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${crop-listing.service.url}")
    private String cropListingServiceUrl;

    /**
     * Fetch all products from crop-listing-service for admin analytics
     * Using direct service-to-service communication, not via API Gateway
     */
    public List<ProductDTO> fetchAllProducts() {
        try {
            // Use the configured URL from application.yml - direct to crop-listing-service
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                cropListingServiceUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            if (response.getBody() != null) {
                return response.getBody().stream()
                    .map(this::mapToProductDTO)
                    .collect(Collectors.toList());
            }
            
            return List.of();
        } catch (Exception e) {
            System.err.println("Error fetching products from crop-listing-service: " + e.getMessage());
            return List.of();
        }
    }

    /**
     * Map raw product data to ProductDTO
     */
    private ProductDTO mapToProductDTO(Map<String, Object> productData) {
        ProductDTO dto = new ProductDTO();
        
        if (productData.get("id") != null) {
            dto.setId(Long.valueOf(productData.get("id").toString()));
        }
        
        if (productData.get("userId") != null) {
            dto.setUserId(Long.valueOf(productData.get("userId").toString()));
        }
        
        dto.setProductName((String) productData.get("productName"));
        dto.setMeasurement((String) productData.get("measurement"));
        
        if (productData.get("pricePerUnit") != null) {
            dto.setPricePerUnit(new BigDecimal(productData.get("pricePerUnit").toString()));
        }
        
        if (productData.get("availableStock") != null) {
            dto.setAvailableStock(Integer.valueOf(productData.get("availableStock").toString()));
        }
        
        dto.setLocation((String) productData.get("location"));
        dto.setTransportAvailability((String) productData.get("transportAvailability"));
        dto.setReturnAccepted((String) productData.get("returnAccepted"));
        
        // Handle badges if present
        if (productData.get("badges") instanceof List) {
            @SuppressWarnings("unchecked")
            List<String> badges = (List<String>) productData.get("badges");
            dto.setBadges(badges);
        }
        
        // Handle imageUrls if present
        if (productData.get("imageUrls") instanceof List) {
            @SuppressWarnings("unchecked")
            List<String> imageUrls = (List<String>) productData.get("imageUrls");
            dto.setImageUrls(imageUrls);
        }
        
        // Handle dates if present
        if (productData.get("createdAt") != null) {
            String createdAtStr = productData.get("createdAt").toString();
            dto.setCreatedAt(LocalDateTime.parse(createdAtStr));
        }
        
        if (productData.get("updatedAt") != null) {
            String updatedAtStr = productData.get("updatedAt").toString();
            dto.setUpdatedAt(LocalDateTime.parse(updatedAtStr));
        }
        
        return dto;
    }
}
