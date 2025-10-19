package com.springcloud.controller;

import com.springcloud.dto.LoadDetailsDto;
import com.springcloud.service.LoadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transport/loads")
@CrossOrigin(origins = "*") // allow frontend to access the API (you can restrict later)
public class LoadController {

    @Autowired
    private LoadService loadService;

    @PostMapping
    public ResponseEntity<LoadDetailsDto> createLoad(@RequestBody LoadDetailsDto loadDetailsDto) {
        LoadDetailsDto savedLoad = loadService.saveLoad(loadDetailsDto);
        return ResponseEntity.ok(savedLoad);
    }

    @GetMapping
    public ResponseEntity<List<LoadDetailsDto>> getAllLoads() {
        List<LoadDetailsDto> loads = loadService.getAllLoads();
        return ResponseEntity.ok(loads);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoadDetailsDto> getLoadById(@PathVariable Long id) {
        LoadDetailsDto load = loadService.getLoadById(id);
        return ResponseEntity.ok(load);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoadDetailsDto> updateLoad(
            @PathVariable Long id,
            @RequestBody LoadDetailsDto loadDetailsDto
    ) {
        LoadDetailsDto updatedLoad = loadService.updateLoad(id, loadDetailsDto);
        return ResponseEntity.ok(updatedLoad);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLoad(@PathVariable Long id) {
        loadService.deleteLoad(id);
        return ResponseEntity.ok("Load deleted successfully with ID: " + id);
    }
}

