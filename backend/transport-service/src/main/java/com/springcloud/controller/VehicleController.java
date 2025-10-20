package com.springcloud.controller;

import com.springcloud.service.VehicleService;
import com.springcloud.dto.VehicleDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transport")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping("/my-vehicle")
    public ResponseEntity<VehicleDto> getMyVehicle(@RequestParam Long providerId) {
        VehicleDto vehicle = vehicleService.getVehicleByProvider(providerId);
        if (vehicle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(vehicle);
    }

    @PostMapping("/createVehicle")
    public ResponseEntity<VehicleDto> createVehicle(@RequestBody VehicleDto vehicleDto) {
        VehicleDto savedVehicle = vehicleService.saveVehicle(vehicleDto);
        return ResponseEntity.ok(savedVehicle);
    }

    @PutMapping("/updateVehicle/{id}")
    public ResponseEntity<VehicleDto> updateVehicle(@PathVariable Long id, @RequestBody VehicleDto vehicle) {
        VehicleDto updatedVehicle = vehicleService.updateVehicle(id, vehicle);
        return ResponseEntity.ok(updatedVehicle);
    }

    @DeleteMapping("/deleteVehicle/{id}")
    public ResponseEntity<VehicleDto> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok().build();
    }

}
