package com.springcloud.service;

import com.springcloud.dto.AvailabilityDto;
import com.springcloud.model.Availability;
import com.springcloud.model.Route;
import com.springcloud.dto.RouteDto;
import com.springcloud.repository.RouteRepository;
import com.springcloud.repository.AvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private AvailabilityRepository availabilityRepository;
    @Autowired
    private org.modelmapper.ModelMapper modelMapper;

    @Override
    @Transactional
    public RouteDto saveRoute(RouteDto routeDto){
        Route route = modelMapper.map(routeDto, Route.class);
        Route savedRoute = routeRepository.save(route);
        return modelMapper.map(savedRoute, RouteDto.class);
    }

    @Override
    @Transactional
    public RouteDto getRouteById(Long id){
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        return modelMapper.map(route, RouteDto.class);
    }

    @Override
    public List<RouteDto>getRoutesByProviderId(Long providerId){
        List<Route> routes = routeRepository.findByProviderId(providerId);
        return routes.stream()
                .map(route -> modelMapper.map(route, RouteDto.class))
                .collect(Collectors.toList());
    }


    @Override
    public RouteDto updateRoute(Long id, RouteDto routeDto){
        Route existingRoute = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Route updatedRoute = updateRouteFromDto(existingRoute,routeDto);

        Route savedRoute = routeRepository.save(updatedRoute);

        return modelMapper.map(savedRoute, RouteDto.class);

    }

    private Route updateRouteFromDto(Route existingRoute, RouteDto routeDto){
        if (routeDto.getFrom() != null) {
            existingRoute.setFrom(routeDto.getFrom());
        }
        if (routeDto.getTo() != null) {
            existingRoute.setTo(routeDto.getTo());
        }
        if (routeDto.getDays() != null && !routeDto.getDays().isEmpty()) {
            existingRoute.setDays(routeDto.getDays());
        }
        if (routeDto.getFrequency() != null) {
            existingRoute.setFrequency(routeDto.getFrequency());
        }
        if (routeDto.getTimeFrom() != null) {
            existingRoute.setTimeFrom(routeDto.getTimeFrom());
        }
        if (routeDto.getTimeTo() != null) {
            existingRoute.setTimeTo(routeDto.getTimeTo());
        }
        if (routeDto.getAllowDetours() != null) {
            existingRoute.setAllowDetours(routeDto.getAllowDetours());
        }
        return existingRoute;
    }

    @Override
    @Transactional
    public void deleteRoute(Long id) {
        if (!routeRepository.existsById(id)) {
            throw new RuntimeException("Route not found");
        }
        routeRepository.deleteById(id);
    }


    @Transactional
    @Override
    public AvailabilityDto saveAvailability(AvailabilityDto availabilityDto){
        Availability availability = modelMapper.map(availabilityDto, Availability.class);
        availability = availabilityRepository.save(availability);
        return modelMapper.map(availability, AvailabilityDto.class);
    }

    @Transactional
    @Override
    public AvailabilityDto getAvailabilityById(Long id){
        Availability availability = availabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability not found"));
        return modelMapper.map(availability, AvailabilityDto.class);
    }

    @Override
    public List<AvailabilityDto> getAvailabilityByProviderId(Long providerId) {
        List<Availability> availabilities = availabilityRepository.findByProviderId(providerId);
        return availabilities.stream()
                .map(availability -> modelMapper.map(availability,AvailabilityDto.class))
                .collect(Collectors.toList());
    }


    @Transactional
    @Override
    public AvailabilityDto updateAvailability(Long id, AvailabilityDto availabilityDto){
        Availability existingAvailability = availabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability not found"));
        Availability updateAvailability = updateAvailabilityFromDto(existingAvailability,availabilityDto);
        Availability savedAvailability = availabilityRepository.save(updateAvailability);
        return modelMapper.map(savedAvailability, AvailabilityDto.class);
    }

    private Availability updateAvailabilityFromDto(Availability existingAvailability, AvailabilityDto availabilityDto){
        if (availabilityDto.getAvailable() != null) {
            existingAvailability.setAvailable(availabilityDto.getAvailable());
        }

        if (availabilityDto.getAllowDetours() != null) {
            existingAvailability.setAllowDetours(availabilityDto.getAllowDetours());
        }

        if (availabilityDto.getCurrentLocation() != null) {
            existingAvailability.setCurrentLocation(availabilityDto.getCurrentLocation());
        }

        if (availabilityDto.getAvailableFrom() != null) {
            existingAvailability.setAvailableFrom(availabilityDto.getAvailableFrom());
        }

        if (availabilityDto.getAvailableTo() != null) {
            existingAvailability.setAvailableTo(availabilityDto.getAvailableTo());
        }

        if (availabilityDto.getUpdatedAt() != null) {
            existingAvailability.setUpdatedAt(availabilityDto.getUpdatedAt());
        }

        if(availabilityDto.getCreatedAt() != null) {
            existingAvailability.setCreatedAt(availabilityDto.getCreatedAt());
        }
        return existingAvailability;
    }

    @Override
    @Transactional
    public void deleteAvailability(Long id){
        if (!availabilityRepository.existsById(id)) {
            throw new RuntimeException("Availability not found");
        }
        availabilityRepository.deleteById(id);
    }


}
