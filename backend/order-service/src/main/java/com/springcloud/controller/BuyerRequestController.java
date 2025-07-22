package com.springcloud.controller;

import com.springcloud.dto.BuyerRequestDto;
import com.springcloud.service.BuyerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/order/buyer-requests")
public class BuyerRequestController {
    @Autowired
    private BuyerRequestService service;


    // Only show OPEN requests to buyers
    @GetMapping
    public List<BuyerRequestDto> getAll() {
        return service.getAllRequests().stream()
                .filter(r -> "OPEN".equals(r.getState()))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuyerRequestDto> getById(@PathVariable Long id) {
        return service.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all requests for a specific buyer (by userId from header)
    @GetMapping("/my")
    public List<BuyerRequestDto> getMyRequests(@RequestHeader("X-User-Id") String userId) {
        return service.getRequestsByUserId(Long.valueOf(userId));
    }

    @PostMapping
    public BuyerRequestDto create(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Roles") String rolesCsv,
            @RequestBody BuyerRequestDto dto) {

        System.out.println("User Id : " + userId);
        System.out.println("Roles : " + rolesCsv);
        return service.createRequest(dto, Long.valueOf(userId), rolesCsv);
    }


    @PutMapping("/{id}")
    public ResponseEntity<BuyerRequestDto> update(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Roles") String rolesCsv,
            @PathVariable Long id,
            @RequestBody BuyerRequestDto dto) {
        try {
            return service.updateRequest(id, dto, Long.valueOf(userId), rolesCsv)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }

        // Cancel a buyer request (only if OPEN)
    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelRequest(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Roles") String rolesCsv) {
        try {
            var canceled = service.cancelRequest(id, Long.valueOf(userId), rolesCsv);
            return ResponseEntity.ok(canceled);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Roles") String rolesCsv,
            @PathVariable Long id) {
        try {
            service.deleteRequest(id, Long.valueOf(userId), rolesCsv);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }
}
