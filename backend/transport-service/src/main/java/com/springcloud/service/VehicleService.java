package com.springcloud.service;

import com.springcloud.dto.VehicleDto;
import com.springcloud.model.Vehicle;
import com.springcloud.dto.RouteDto;
import com.springcloud.repository.VehicleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public interface VehicleService {
    VehicleDto getVehicleByProvider(Long providerId);
    VehicleDto saveVehicle(VehicleDto vehicleDto);
    VehicleDto updateVehicle(VehicleDto vehicleDto);
    void deleteVehicle(Long vehicleId);
}
