package com.springcloud.controller;

import com.springcloud.dto.RequestDTO;
import com.springcloud.dto.WasteListingDTO;
import com.springcloud.dto.RequestCreateDTO;
import com.springcloud.mapper.RequestMapper;
import com.springcloud.mapper.WasteListingMapper;
import com.springcloud.service.RequestService;
import com.springcloud.client.AuthClient;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waste/requests")
//@CrossOrigin(origins = "http://localhost:5173") // allow React frontend
public class RequestController {

    private final RequestService requestService;
    private final RequestMapper requestMapper;
    private final WasteListingMapper wasteListingMapper;
    private final AuthClient authClient;

    public RequestController(RequestService requestService, RequestMapper requestMapper, WasteListingMapper wasteListingMapper, AuthClient authClient) {
        this.requestService = requestService;
        this.requestMapper = requestMapper;
        this.wasteListingMapper = wasteListingMapper;
        this.authClient = authClient;
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
    public List<RequestDTO> getRequestsByStatus(
            @PathVariable String status,
            @RequestHeader("X-User-Id") Long userId
    ) {
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

    // Create a new request (CreateDTO → Entity → DTO)
    @PostMapping
    public RequestDTO createRequest(@Valid @RequestBody RequestCreateDTO dto,
                                    @RequestHeader(value = "X-User-Name", required = false) String username) {
        if (username == null || username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "X-User-Name header is required");
        }
        var user = authClient.getUser(new AuthClient.UserRequest(username));

        var entity = requestMapper.fromCreateDTO(dto);
        // Override requesterName with resolved username from auth-service
        entity.setRequesterName(user.username());
        var saved = requestService.createRequestFromCreateDTO(entity);
        return requestMapper.toDTO(saved);
    }

    // Delete a request
    @DeleteMapping("/{id}")
    public void deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
    }

    @PutMapping("/{id}/accept")
    public WasteListingDTO acceptRequest(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(required = false) Long relatedListingId
    ) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "X-User-Id header is required");
        }
        var listing = requestService.acceptRequest(id, userId, relatedListingId);
        return wasteListingMapper.toDTO(listing);
    }
}
