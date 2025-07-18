package com.springcloud.transport.route.service;

import com.springcloud.transport.route.model.Route;
import com.springcloud.transport.route.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RouteServiceImpl implements RouteService {

    @Autowired
    private RouteRepository routeRepository;

    @Override
    public Route createRoute(Route route) {
        return routeRepository.save(route);
    }

    @Override
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Override
    public Route updateRoute(Long id, Route updatedRoute) {
        Optional<Route> existing = routeRepository.findById(id);
        if (existing.isPresent()) {
            Route route = existing.get();
            route.setStartingLocation(updatedRoute.getStartingLocation());
            route.setDestination(updatedRoute.getDestination());
            route.setDistance(updatedRoute.getDistance());
            route.setEstimatedTime(updatedRoute.getEstimatedTime());
            route.setRouteDate(updatedRoute.getRouteDate());
            return routeRepository.save(route);
        } else {
            throw new RuntimeException("Route with ID " + id + " not found.");
        }
    }

    @Override
    public void deleteRoute(Long id) {
        routeRepository.deleteById(id);
    }
}
