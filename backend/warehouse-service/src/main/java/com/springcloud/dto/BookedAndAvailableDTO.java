package com.springcloud.dto;

import lombok.AllArgsConstructor;   
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class BookedAndAvailableDTO {
    private List<SlotResponseDTO> booked;
    private List<Integer> availableNumbers;
}