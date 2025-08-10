package com.springcloud.service;

import com.springcloud.dto.OrderDTO;
import com.springcloud.dto.OrderItemDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderAnalyticsService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${order.service.url}")
    private String orderServiceUrl;

    /**
     * Fetch all orders from order-service for admin analytics
     */
    public List<OrderDTO> fetchAllOrders() {
        try {
            // Use the configured URL from application.yml
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                orderServiceUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            if (response.getBody() != null) {
                return response.getBody().stream()
                    .map(this::mapToOrderDTO)
                    .collect(Collectors.toList());
            }
            
            return List.of();
        } catch (Exception e) {
            System.err.println("Error fetching orders from order-service: " + e.getMessage());
            return List.of();
        }
    }

    /**
     * Get total order count
     */
    public long getTotalOrderCount() {
        try {
            List<OrderDTO> orders = fetchAllOrders();
            return orders.size();
        } catch (Exception e) {
            System.err.println("Error getting total order count: " + e.getMessage());
            return 0;
        }
    }

    /**
     * Get order count by status
     */
    public Map<String, Long> getOrderCountByStatus() {
        try {
            List<OrderDTO> orders = fetchAllOrders();
            return orders.stream()
                .collect(Collectors.groupingBy(
                    OrderDTO::getStatus,
                    Collectors.counting()
                ));
        } catch (Exception e) {
            System.err.println("Error getting order count by status: " + e.getMessage());
            return Map.of();
        }
    }

    /**
     * Get orders by status
     */
    public List<OrderDTO> getOrdersByStatus(String status) {
        try {
            List<OrderDTO> orders = fetchAllOrders();
            return orders.stream()
                .filter(order -> status.equalsIgnoreCase(order.getStatus()))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting orders by status: " + e.getMessage());
            return List.of();
        }
    }

    /**
     * Map raw order data to OrderDTO
     */
    private OrderDTO mapToOrderDTO(Map<String, Object> orderData) {
        OrderDTO dto = new OrderDTO();
        
        if (orderData.get("orderId") != null) {
            dto.setOrderId(Long.valueOf(orderData.get("orderId").toString()));
        }
        
        dto.setPaymentId((String) orderData.get("paymentId"));
        
        if (orderData.get("total") != null) {
            dto.setTotal(new java.math.BigDecimal(orderData.get("total").toString()));
        }
        
        if (orderData.get("farmerId") != null) {
            dto.setFarmerId(Long.valueOf(orderData.get("farmerId").toString()));
        }
        
        if (orderData.get("buyerId") != null) {
            dto.setBuyerId(Long.valueOf(orderData.get("buyerId").toString()));
        }
        
        dto.setStatus((String) orderData.get("status"));
        dto.setTransport((String) orderData.get("transport"));
        
        // Handle items if present
        if (orderData.get("items") instanceof List) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) orderData.get("items");
            List<OrderItemDTO> items = itemsData.stream()
                .map(this::mapToOrderItemDTO)
                .collect(Collectors.toList());
            dto.setItems(items);
        }
        
        return dto;
    }

    /**
     * Map raw order item data to OrderItemDTO
     */
    private OrderItemDTO mapToOrderItemDTO(Map<String, Object> itemData) {
        OrderItemDTO dto = new OrderItemDTO();
        
        if (itemData.get("id") != null) {
            dto.setId(Long.valueOf(itemData.get("id").toString()));
        }
        
        if (itemData.get("cropId") != null) {
            dto.setCropId(Long.valueOf(itemData.get("cropId").toString()));
        }
        
        if (itemData.get("pricePerUnit") != null) {
            dto.setPricePerUnit(new java.math.BigDecimal(itemData.get("pricePerUnit").toString()));
        }
        
        dto.setUnitMeasurement((String) itemData.get("unitMeasurement"));
        
        if (itemData.get("quantity") != null) {
            dto.setQuantity(new java.math.BigDecimal(itemData.get("quantity").toString()));
        }
        
        return dto;
    }
}
