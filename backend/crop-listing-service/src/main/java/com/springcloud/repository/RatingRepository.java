package com.springcloud.repository;

import com.springcloud.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    // Find a specific rating by a user for a product
    Optional<Rating> findByProductIdAndUserId(Long productId, Long userId);

    // Find all ratings for a given product to calculate the average
    List<Rating> findByProductId(Long productId);
}