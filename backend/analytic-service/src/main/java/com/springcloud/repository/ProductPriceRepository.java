package com.springcloud.repository;

import com.springcloud.model.ProductPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long> {
    List<ProductPrice> findByActive(Boolean active);
    List<ProductPrice> findByCategory(String category);
}
