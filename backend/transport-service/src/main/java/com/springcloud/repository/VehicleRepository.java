package com.springcloud.repository;

import com.springcloud.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByProviderId(Long providerId);
    void deleteById(Long Id);
    boolean existsByProviderId(Long providerId);
}
