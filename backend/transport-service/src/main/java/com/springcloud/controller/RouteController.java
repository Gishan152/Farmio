package com.springcloud.controller;

import com.springcloud.model.Route;
import com.springcloud.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transport")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @PostMapping("/createRoute")
    public Route createRoute(@RequestBody Route route) {
        return routeService.createRoute(route);
    }

    @GetMapping("/getRoute")
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @PutMapping("/editRoute/{id}")
    public Route updateRoute(@PathVariable Long id, @RequestBody Route route) {
        return routeService.updateRoute(id, route);
    }

    @DeleteMapping("/deleteRoute/{id}")
    public void deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
    }
}
