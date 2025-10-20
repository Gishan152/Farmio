package com.springcloud.repository;

import com.springcloud.model.LoadDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoadRepository extends JpaRepository<LoadDetails, Long> {
}
