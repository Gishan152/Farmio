package com.springcloud.repository;

import com.springcloud.model.Warehouse;
import com.springcloud.model.WarehouseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    
    List<Warehouse> findByOwnerId(Long ownerId);
    
    List<Warehouse> findByStatus(WarehouseStatus status);
    
    List<Warehouse> findByCity(String city);
    
    @Query("SELECT w FROM Warehouse w WHERE " +
           "LOWER(w.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(w.address) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(w.city) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Warehouse> searchWarehouses(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT w FROM Warehouse w WHERE w.ownerId = :ownerId AND " +
           "(LOWER(w.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(w.address) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Warehouse> searchWarehousesByOwner(@Param("ownerId") Long ownerId, 
                                          @Param("searchTerm") String searchTerm);
    
    Optional<Warehouse> findByIdAndOwnerId(Long id, Long ownerId);
    
    /**
     * Find warehouses within a certain distance from given coordinates
     * Using Haversine formula for distance calculation
     */
    @Query(value = "SELECT *, " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(latitude)) * " +
           "cos(radians(longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(latitude)))) AS distance " +
           "FROM warehouses w " +
           "WHERE w.status = 'ACTIVE' " +
           "AND w.latitude IS NOT NULL " +
           "AND w.longitude IS NOT NULL " +
           "HAVING distance <= :radiusKm " +
           "ORDER BY distance", 
           nativeQuery = true)
    List<Object[]> findWarehousesWithinRadius(@Param("latitude") Double latitude,
                                             @Param("longitude") Double longitude,
                                             @Param("radiusKm") Double radiusKm);
    
    /**
     * Find active warehouses with complete location data
     */
    @Query("SELECT w FROM Warehouse w WHERE w.status = :status " +
           "AND w.latitude IS NOT NULL AND w.longitude IS NOT NULL")
    List<Warehouse> findByStatusWithLocation(@Param("status") WarehouseStatus status);
}
