package com.springcloud.repository;

import com.springcloud.model.WasteAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WasteAgentRepository extends JpaRepository<WasteAgent, Long> {
    
    // Find active waste agents
    List<WasteAgent> findByIsActiveTrue();
    
    // Find verified waste agents
    List<WasteAgent> findByIsVerifiedTrue();
    
    // Find active and verified waste agents
    List<WasteAgent> findByIsActiveTrueAndIsVerifiedTrue();
    
    // Find by city
    List<WasteAgent> findByCity(String city);
    
    // Find by specialization
    List<WasteAgent> findBySpecialization(String specialization);
    
    // Find by city and specialization
    List<WasteAgent> findByCityAndSpecialization(String city, String specialization);
    
    // Find by email
    Optional<WasteAgent> findByEmail(String email);
    
    // Find by license number
    Optional<WasteAgent> findByLicenseNumber(String licenseNumber);
    
    // Search waste agents by name, company, or city
    @Query("SELECT w FROM WasteAgent w WHERE w.isActive = true AND (" +
           "LOWER(w.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(w.companyName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(w.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<WasteAgent> searchActiveWasteAgents(@Param("searchTerm") String searchTerm);
    
    // Find waste agents within service radius of a city
    @Query("SELECT w FROM WasteAgent w WHERE w.isActive = true AND w.isVerified = true AND " +
           "(w.city = :city OR w.serviceRadius >= 50)")
    List<WasteAgent> findWasteAgentsServingCity(@Param("city") String city);
    
    // Find top rated waste agents
    @Query("SELECT w FROM WasteAgent w WHERE w.isActive = true AND w.isVerified = true " +
           "ORDER BY w.rating DESC, w.totalReviews DESC")
    List<WasteAgent> findTopRatedWasteAgents();
    
    // Find waste agents by minimum rating
    List<WasteAgent> findByIsActiveTrueAndIsVerifiedTrueAndRatingGreaterThanEqual(Double minRating);
    
    // Count active waste agents by city
    @Query("SELECT COUNT(w) FROM WasteAgent w WHERE w.isActive = true AND w.city = :city")
    Long countActiveWasteAgentsByCity(@Param("city") String city);
    
    // Find waste agents by multiple cities
    List<WasteAgent> findByIsActiveTrueAndCityIn(List<String> cities);
}