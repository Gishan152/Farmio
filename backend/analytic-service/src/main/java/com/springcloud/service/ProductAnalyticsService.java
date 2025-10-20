package com.springcloud.service;

import com.springcloud.dto.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
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
    
    @Value("${order.service.url}")
    private String orderServiceUrl;

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
    
    /**
     * Check if a product can be deleted by verifying if it's used in any orders
     * @param productId The ID of the product to check
     * @return true if the product can be deleted (not used in any orders), false otherwise
     */
    public boolean checkProductCanBeDeleted(Long productId) {
        if (productId == null) {
            return false;
        }
        
        try {
            // First, check if the product exists
            String productUrl = cropListingServiceUrl + "/" + productId;
            try {
                ResponseEntity<Map<String, Object>> productResponse = restTemplate.exchange(
                    productUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
                );
                
                // If product doesn't exist, return false
                if (productResponse.getStatusCode().is4xxClientError()) {
                    System.err.println("Product not found with ID: " + productId);
                    return false;
                }
            } catch (HttpClientErrorException e) {
                if (e.getRawStatusCode() == 404) {
                    System.err.println("Product not found with ID: " + productId);
                    return false;
                }
                throw e;
            }
            
            // Now check if the product is used in any orders
            // We'll use a dedicated endpoint in the order-service to check this
            String checkOrdersUrl = orderServiceUrl + "/check-product-usage/" + productId;
            try {
                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    checkOrdersUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
                );
                
                if (response.getBody() != null && response.getBody().containsKey("inUse")) {
                    boolean inUse = (Boolean) response.getBody().get("inUse");
                    return !inUse; // If not in use, can delete
                }
                
                // If we can't get a clear answer, assume it's not safe to delete
                return false;
            } catch (HttpClientErrorException e) {
                // If endpoint doesn't exist, fallback to a more direct check
                if (e.getRawStatusCode() == 404) {
                    return checkProductUsageDirectly(productId);
                }
                throw e;
            }
        } catch (Exception e) {
            System.err.println("Error checking if product can be deleted: " + e.getMessage());
            e.printStackTrace();
            // If there's an error, assume it's not safe to delete
            return false;
        }
    }
    
    /**
     * Alternative method to directly check if a product is used in any orders
     * This is used as a fallback if the dedicated endpoint is not available
     */
    private boolean checkProductUsageDirectly(Long productId) {
        try {
            // Fetch all orders
            ResponseEntity<List<Map<String, Object>>> ordersResponse = restTemplate.exchange(
                orderServiceUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            
            if (ordersResponse.getBody() == null) {
                // If we can't get orders, assume not safe to delete
                return false;
            }
            
            // Check each order for the product
            for (Map<String, Object> order : ordersResponse.getBody()) {
                if (order.containsKey("items") && order.get("items") instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> items = (List<Map<String, Object>>) order.get("items");
                    
                    for (Map<String, Object> item : items) {
                        if (item.containsKey("cropId")) {
                            Long cropId = Long.valueOf(item.get("cropId").toString());
                            if (productId.equals(cropId)) {
                                // Product is used in this order
                                return false;
                            }
                        }
                    }
                }
            }
            
            // Product is not used in any order
            return true;
        } catch (Exception e) {
            System.err.println("Error checking product usage directly: " + e.getMessage());
            // If there's an error, assume it's not safe to delete
            return false;
        }
    }
    
    /**
     * Delete a product from the crop-listing-service
     * @param productId The ID of the product to delete
     * @return true if the product was successfully deleted, false otherwise
     */
    public boolean deleteProduct(Long productId) {
        try {
            // Build the URL for the specific product
            String deleteUrl = cropListingServiceUrl + "/" + productId;
            
            // Make the DELETE request
            restTemplate.delete(deleteUrl);
            
            // If no exception is thrown, assume success
            System.out.println("Successfully deleted product with ID: " + productId);
            return true;
        } catch (Exception e) {
            System.err.println("Error deleting product with ID " + productId + ": " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
