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

    public VehicleDto updateVehicle(Long id, VehicleDto vehicleDto) {
        Vehicle existingVehicle = vehicleRepository.findByProviderId(vehicleDto.getProviderId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found for provider: " + vehicleDto.getProviderId()));

        Vehicle updatedVehicle = updateVehicleFromDto(existingVehicle, vehicleDto);
        Vehicle savedVehicle = vehicleRepository.save(updatedVehicle);
        return modelMapper.map(savedVehicle, VehicleDto.class);
    }

    private Vehicle updateVehicleFromDto(Vehicle existingVehicle, VehicleDto vehicleDto) {
        if (vehicleDto.getRegNo() != null) {
            existingVehicle.setRegNo(vehicleDto.getRegNo());
        }
        if (vehicleDto.getType() != null) {
            existingVehicle.setType(vehicleDto.getType());
        }
        if (vehicleDto.getKind() != null) {
            existingVehicle.setKind(vehicleDto.getKind());
        }
        if (vehicleDto.getMaxLoad() != null) {
            existingVehicle.setMaxLoad(vehicleDto.getMaxLoad());
        }
        if (vehicleDto.getFrontPhoto() != null) {
            existingVehicle.setFrontPhoto(vehicleDto.getFrontPhoto());
        }
        if (vehicleDto.getSidePhoto() != null) {
            existingVehicle.setSidePhoto(vehicleDto.getSidePhoto());
        }
        return existingVehicle;
    }

    public void deleteVehicle(Long vehicleId){
        vehicleRepository.deleteById(vehicleId);
    }
}
