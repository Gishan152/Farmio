package com.springcloud.controller;

import com.springcloud.model.WasteAgent;
import com.springcloud.service.WasteAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/waste/waste-agents")
public class WasteAgentController {

    private final WasteAgentService wasteAgentService;

    @Autowired
    public WasteAgentController(WasteAgentService wasteAgentService) {
        this.wasteAgentService = wasteAgentService;
    }

    @GetMapping("/health")
    public String checkDatabaseHealth() {
        boolean isDbUp = wasteAgentService.isDatabaseUp();
        return isDbUp ? "Database is UP" : "Database is DOWN";
    }

    @GetMapping
    public List<WasteAgent> getAllWasteAgents() {
        return wasteAgentService.getAllWasteAgents();
    }

    @GetMapping("/{id}")
    public WasteAgent getWasteAgentById(@PathVariable Long id) {
        return wasteAgentService.getWasteAgentById(id);
    }
}
