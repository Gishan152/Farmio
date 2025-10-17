package com.springcloud.service;

import com.springcloud.dto.RouteDto;
import com.springcloud.dto.AvailabilityDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RouteService {
    RouteDto saveRoute(RouteDto routeDto);
    RouteDto getRouteById(Long id);
    List<RouteDto> getRoutesByProviderId(Long providerId);
    RouteDto updateRoute(Long id, RouteDto routeDto);
    void deleteRoute(Long id);

    // Availability operations
    AvailabilityDto saveAvailability(AvailabilityDto availabilityDto);
    AvailabilityDto getAvailabilityById(Long id);
    List<AvailabilityDto> getAvailabilityByProviderId(Long providerId);
    AvailabilityDto updateAvailability(Long id, AvailabilityDto availabilityDto);
    void deleteAvailability(Long id);

}
