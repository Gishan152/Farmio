package com.springcloud.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotCreationDTO {
    private String slotNumber;
    private Integer capacityKg;
    private String productType;
    private String notes;
}