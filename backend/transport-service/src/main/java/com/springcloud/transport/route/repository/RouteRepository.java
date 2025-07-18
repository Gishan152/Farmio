package com.springcloud.transport.route.repository;

import com.springcloud.transport.route.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route, Long> {
}
