package com.springcloud.repository;

import com.springcloud.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    
    List<Facility> findByOwnerId(Long ownerId);
    
    List<Facility> findByType(String type);
    
    List<Facility> findByStatus(com.springcloud.model.FacilityStatus status);
    
    List<Facility> findByCityAndState(String city, String state);
    
    @Query("SELECT f FROM Facility f WHERE f.ownerId = :ownerId AND " +
           "(LOWER(f.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.type) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Facility> searchFacilitiesByOwner(@Param("ownerId") Long ownerId, @Param("searchTerm") String searchTerm);
    
    @Query("SELECT f FROM Facility f WHERE f.availableCapacity > 0 AND f.status = 'OPERATIONAL'")
    List<Facility> findAvailableFacilities();
    
    Optional<Facility> findByIdAndOwnerId(Long id, Long ownerId);
} 