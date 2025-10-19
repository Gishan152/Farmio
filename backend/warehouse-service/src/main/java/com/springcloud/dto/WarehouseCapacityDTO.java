package com.springcloud.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseCapacityDTO {
    
    private Long warehouseId;
    private String warehouseName;
    private Integer totalCapacity;
    private Integer usedCapacity;
    private Integer availableCapacity;
    private Integer totalSlots;
    private Integer usedSlots;
    private Integer availableSlots;
    private BigDecimal pricePerKg;
    private Double utilizationPercentage;
    
    // Static factory method as used in the service
    public static WarehouseCapacityDTO of(Long warehouseId, String warehouseName, 
                                         Integer totalCapacity, Integer usedCapacity,
                                         Integer totalSlots, Integer usedSlots,
                                         BigDecimal pricePerKg) {
        WarehouseCapacityDTO dto = new WarehouseCapacityDTO();
        dto.setWarehouseId(warehouseId);
        dto.setWarehouseName(warehouseName);
        dto.setTotalCapacity(totalCapacity);
        dto.setUsedCapacity(usedCapacity);
        dto.setAvailableCapacity(totalCapacity - usedCapacity);
        dto.setTotalSlots(totalSlots);
        dto.setUsedSlots(usedSlots);
        dto.setAvailableSlots(totalSlots - usedSlots);
        dto.setPricePerKg(pricePerKg);
        
        // Calculate utilization percentage
        if (totalCapacity > 0) {
            dto.setUtilizationPercentage((double) usedCapacity / totalCapacity * 100);
        } else {
            dto.setUtilizationPercentage(0.0);
        }
        
        return dto;
    }
}