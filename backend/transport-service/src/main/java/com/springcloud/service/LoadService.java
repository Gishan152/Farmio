package com.springcloud.service;

import com.springcloud.dto.LoadDetailsDto;
import com.springcloud.model.LoadDetails;

import java.util.List;
import java.util.Optional;

public interface LoadService {
    LoadDetailsDto saveLoad(LoadDetailsDto loadDetailsDto);
    List<LoadDetailsDto> getAllLoads();
    LoadDetailsDto getLoadById(Long id);
    LoadDetailsDto updateLoad(Long id,LoadDetailsDto loadDetailsDto);
    void deleteLoad(Long id);
    LoadDetailsDto acceptLoadDriver(Long id, Long driverId);
    LoadDetailsDto acceptPickupDriver(Long id, Long driverId);
    LoadDetailsDto acceptDeliveryDriver(Long id, Long driverId);
    LoadDetailsDto acceptLoadBuyer(Long id);
    LoadDetailsDto acceptLoadSeller(Long id);
}
