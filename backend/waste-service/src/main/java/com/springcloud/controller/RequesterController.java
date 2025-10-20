package com.springcloud.controller;

import com.springcloud.model.Requester;
import com.springcloud.service.RequesterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waste/requesters")
public class RequesterController {

    private final RequesterService requesterService;

    public RequesterController(RequesterService requesterService) {
        this.requesterService = requesterService;
    }

    // GET /requesters → list all requesters
    @GetMapping
    public List<Requester> getAllRequesters() {
        return requesterService.getAllRequesters();
    }

    // GET /requesters/{id} → get one requester by ID
    @GetMapping("/{id}")
    public Requester getRequesterById(@PathVariable Long id) {
        return requesterService.getRequesterById(id);
    }
}
