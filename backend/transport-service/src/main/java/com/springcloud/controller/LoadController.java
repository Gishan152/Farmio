package com.springcloud.controller;

import com.springcloud.dto.LoadDetailsDto;
import com.springcloud.service.LoadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transport")
@CrossOrigin(origins = "*") // allow frontend to access the API (you can restrict later)
public class LoadController {

    @Autowired
    private LoadService loadService;

    @PostMapping("/createLoad")
    public ResponseEntity<LoadDetailsDto> createLoad(@RequestBody LoadDetailsDto loadDetailsDto) {
        LoadDetailsDto savedLoad = loadService.saveLoad(loadDetailsDto);
        return ResponseEntity.ok(savedLoad);
    }

    @GetMapping("/getAllLoads")
    public ResponseEntity<List<LoadDetailsDto>> getAllLoads() {
        List<LoadDetailsDto> loads = loadService.getAllLoads();
        return ResponseEntity.ok(loads);
    }

    @GetMapping("/getLoadById/{id}")
    public ResponseEntity<LoadDetailsDto> getLoadById(@PathVariable Long id) {
        LoadDetailsDto load = loadService.getLoadById(id);
        return ResponseEntity.ok(load);
    }

    @PutMapping("/updateLoad/{id}")
    public ResponseEntity<LoadDetailsDto> updateLoad(
            @PathVariable Long id,
            @RequestBody LoadDetailsDto loadDetailsDto
    ) {
        LoadDetailsDto updatedLoad = loadService.updateLoad(id, loadDetailsDto);
        return ResponseEntity.ok(updatedLoad);
    }

    @DeleteMapping("deleteLoad/{id}")
    public ResponseEntity<String> deleteLoad(@PathVariable Long id) {
        loadService.deleteLoad(id);
        return ResponseEntity.ok("Load deleted successfully with ID: " + id);
    }

    @PutMapping("/acceptLoad/{id}/{driverId}")
    public ResponseEntity<LoadDetailsDto> acceptLoad(@PathVariable Long id,
                                                     @PathVariable Long driverId) {
        LoadDetailsDto updated = loadService.acceptLoad(id, driverId);
        return ResponseEntity.ok(updated);
    }
}

