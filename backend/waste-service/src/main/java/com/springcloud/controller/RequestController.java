package com.springcloud.controller;

import com.springcloud.dto.RequestDTO;
import com.springcloud.mapper.RequestMapper;
import com.springcloud.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
@CrossOrigin(origins = "http://localhost:5173") // allow React frontend
public class RequestController {

    private final RequestService requestService;
    private final RequestMapper requestMapper;

    public RequestController(RequestService requestService, RequestMapper requestMapper) {
        this.requestService = requestService;
        this.requestMapper = requestMapper;
    }

    // Get all requests
    @GetMapping
    public List<RequestDTO> getRequests(@RequestParam(required = false) String status) {
        if (status != null) {
            return requestService.getRequestsByStatus(status)
                    .stream()
                    .map(requestMapper::toDTO)
                    .toList();
        }
        return requestService.getAllRequests()
                .stream()
                .map(requestMapper::toDTO)
                .toList();
    }


    // Get requests by status
    @GetMapping("/status/{status}")
    public List<RequestDTO> getRequestsByStatus(@PathVariable String status) {
        return requestService.getRequestsByStatus(status)
                .stream()
                .map(requestMapper::toDTO)
                .toList();
    }

    // Get single request
    @GetMapping("/{id}")
    public RequestDTO getRequestById(@PathVariable Long id) {
        return requestMapper.toDTO(requestService.getRequestById(id));
    }

    // Update request status
    @PutMapping("/{id}/status")
    public RequestDTO updateStatus(@PathVariable Long id, @RequestParam String status) {
        var updated = requestService.updateRequestStatus(id, status);
        return requestMapper.toDTO(updated);
    }

    // Create a new request (DTO → Entity → DTO)
    @PostMapping
    public RequestDTO createRequest(@Valid @RequestBody RequestDTO dto) {
        var entity = requestMapper.toEntity(dto);
        var saved = requestService.createRequest(entity);
        return requestMapper.toDTO(saved);
    }


    // Delete a request
    @DeleteMapping("/{id}")
    public void deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
    }
}
