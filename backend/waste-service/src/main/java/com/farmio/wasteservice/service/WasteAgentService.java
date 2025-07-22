package com.farmio.wasteservice.service;

import com.farmio.wasteservice.model.WasteAgent;
import com.farmio.wasteservice.repository.WasteAgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WasteAgentService {

    private final WasteAgentRepository wasteAgentRepository;

    @Autowired
    public WasteAgentService(WasteAgentRepository wasteAgentRepository) {
        this.wasteAgentRepository = wasteAgentRepository;
    }

    public List<WasteAgent> getAllWasteAgents() {
        return wasteAgentRepository.findAll();
    }

    public WasteAgent getWasteAgentById(Long id) {
        return wasteAgentRepository.findById(id).orElse(null);
    }
}
