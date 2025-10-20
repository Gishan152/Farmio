package com.springcloud.dto;

import com.springcloud.model.StoredItem;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SlotBookingDTO {
    @NotBlank private String slotNumber;
    @NotNull  private Integer capacityKg;
    @NotNull  private Integer reservedLoadKg;
    private String productType;
    private List<StoredItem> storedItems;
    @NotNull @Future private LocalDateTime reservedUntil;
    private String notes;
}