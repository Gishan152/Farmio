package com.springcloud.transport.route.service;

import com.springcloud.transport.route.model.Route;
import java.util.List;

public interface RouteService {
    Route createRoute(Route route);
    List<Route> getAllRoutes();
    Route updateRoute(Long id, Route updatedRoute);
    void deleteRoute(Long id);
}
