package com.springcloud.service;

import com.springcloud.dto.VehicleDto;
import com.springcloud.model.Vehicle;
import com.springcloud.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private org.modelmapper.ModelMapper modelMapper;

    public VehicleDto getVehicleByProvider(Long providerId){
        Optional<Vehicle> vehicle = vehicleRepository.findByProviderId(providerId);
        return vehicle.map(v -> modelMapper.map(v,VehicleDto.class))
                .orElse(null);
    }

    public VehicleDto saveVehicle(VehicleDto vehicleDto){
        Vehicle vehicle = modelMapper.map(vehicleDto, Vehicle.class);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return modelMapper.map(savedVehicle, VehicleDto.class);
    }

    public VehicleDto updateVehicle(VehicleDto vehicleDto){
        Optional<Vehicle> existingVehicle = vehicleRepository.findByProviderId(vehicleDto.getProviderId());

        Vehicle vehicle = existingVehicle.get();
        modelMapper.map(vehicleDto, vehicle);

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return modelMapper.map(updatedVehicle, VehicleDto.class);
    }

    public void deleteVehicle(Long vehicleId){
        vehicleRepository.deleteById(vehicleId);
    }
}
