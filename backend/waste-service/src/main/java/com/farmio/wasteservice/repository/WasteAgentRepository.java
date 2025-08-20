package com.farmio.wasteservice.repository;

import com.farmio.wasteservice.model.WasteAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WasteAgentRepository extends JpaRepository<WasteAgent, Long> {
}
