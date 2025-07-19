package com.springcloud.repository;

import com.springcloud.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {


    // Find products by user ID
    List<Product> findByUserId(Long userId);

    // … your other findByUserId / findByProductName / etc …

    // Find products by user ID and location
    List<Product> findByUserIdAndLocation(Long userId, String location);

    // Count products by user ID
    long countByUserId(Long userId);

    // Find products by user ID ordered by creation date (newest first)
    List<Product> findByUserIdOrderByCreatedAtDesc(Long userId);

    // … and remove or rename any other methods that mention “FarmerId” …

}