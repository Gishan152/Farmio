package com.springcloud.service;

import com.springcloud.model.WasteAgent;
import com.springcloud.repository.WasteAgentRepository;
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

    public boolean isDatabaseUp() {
        try {
            wasteAgentRepository.count();
            return true;
        } catch (Exception e) {
            return false;
        }
    }



    public List<WasteAgent> getAllWasteAgents() {
        return wasteAgentRepository.findAll();
    }

    public WasteAgent getWasteAgentById(Long id) {
        return wasteAgentRepository.findById(id).orElse(null);
    }
}
