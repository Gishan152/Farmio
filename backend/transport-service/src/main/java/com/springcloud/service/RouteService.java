package com.springcloud.service;

import com.springcloud.model.Route;
import java.util.List;

public interface RouteService {
    Route createRoute(Route route);
    List<Route> getAllRoutes();
    Route updateRoute(Long id, Route updatedRoute);
    void deleteRoute(Long id);
}
