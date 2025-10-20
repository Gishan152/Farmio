package com.springcloud.controller;

import com.springcloud.dto.RouteDto;
import com.springcloud.dto.AvailabilityDto;
import com.springcloud.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transport")
public class RouteController {

    @Autowired
    private RouteService routeService;

    //_______ Route endpoints ________

    @PostMapping("/createRoute")
    public ResponseEntity<RouteDto> createRoute(@RequestBody RouteDto routeDto) {
        RouteDto savedRoute = routeService.saveRoute(routeDto);
        return ResponseEntity.ok(savedRoute);
    }

    @GetMapping("/getAllRoutes/{providerId}")
    public ResponseEntity<List<RouteDto>> getRoutesByProvider(@PathVariable Long providerId) {
        List<RouteDto> routes = routeService.getRoutesByProviderId(providerId);
        return ResponseEntity.ok(routes);
    }


    @GetMapping("/route/{id}")
    public ResponseEntity<RouteDto> getRoute(@PathVariable Long id) {
        RouteDto routeDto = routeService.getRouteById(id);
        return ResponseEntity.ok(routeDto);
    }

    @PutMapping("/editRoute/{id}")
    public ResponseEntity<RouteDto> updateRoute(@PathVariable Long id, @RequestBody RouteDto routeDto) {
        RouteDto updatedRoute = routeService.updateRoute(id, routeDto);
        return ResponseEntity.ok(updatedRoute);
    }

    @DeleteMapping("/deleteRoute/{id}")
    public ResponseEntity<RouteDto> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok().build();
    }

    //_______ Availability Endpoints ________

    @PostMapping("/createAvailability")
    public ResponseEntity<AvailabilityDto> createAvailability(@RequestBody AvailabilityDto availabilityDto) {
        AvailabilityDto savedAvailability = routeService.saveAvailability(availabilityDto);
        return ResponseEntity.ok(savedAvailability);
    }

    @PutMapping("/editAvailability/{id}")
    public ResponseEntity<AvailabilityDto> updateAvailability(@PathVariable Long id, @RequestBody AvailabilityDto availabilityDto) {
        AvailabilityDto updatedAvailability = routeService.updateAvailability(id, availabilityDto);
        return ResponseEntity.ok(updatedAvailability);
    }

    @GetMapping("/getAllAvailabilities/{providerId}")
    public ResponseEntity<List<AvailabilityDto>> getAvailabilityByProvider(@PathVariable Long providerId) {
        List<AvailabilityDto> availabilities = routeService.getAvailabilityByProviderId(providerId);
        return ResponseEntity.ok(availabilities);
    }

    @GetMapping("/availability/{id}")
    public ResponseEntity<AvailabilityDto> getAvailability(@PathVariable Long id) {
        AvailabilityDto availability = routeService.getAvailabilityById(id);
        return ResponseEntity.ok(availability);
    }

    @DeleteMapping("/deleteAvailability/{id}")
    public ResponseEntity<AvailabilityDto> deleteAvailability(@PathVariable Long id) {
        routeService.deleteAvailability(id);
        return ResponseEntity.ok().build();
    }
}
