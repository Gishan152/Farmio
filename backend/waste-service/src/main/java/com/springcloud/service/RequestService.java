package com.springcloud.service;

import com.springcloud.model.Request;
import com.springcloud.model.Requester;
import com.springcloud.model.WasteListing;
import com.springcloud.repository.RequestRepository;
import com.springcloud.repository.RequesterRepository;
import com.springcloud.repository.WasteListingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final WasteListingRepository wasteListingRepository;
    private final RequesterRepository requesterRepository;

    public RequestService(RequestRepository requestRepository,
                          WasteListingRepository wasteListingRepository,
                          RequesterRepository requesterRepository) {
        this.requestRepository = requestRepository;
        this.wasteListingRepository = wasteListingRepository;
        this.requesterRepository = requesterRepository;
    }

    // Get all requests
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    // Get requests by status (Pending, Accepted, Rejected)
    public List<Request> getRequestsByStatus(String status) {
        return requestRepository.findByStatus(status);
    }

    // Get a single request by ID
    public Request getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id " + id));
    }

    // Create a new request
    public Request createRequest(Request request) {
        request.setStatus("Pending"); // default status
        if (request.getRequestDate() == null) {
            request.setRequestDate(LocalDate.now());
        }
        return requestRepository.save(request);
    }

    // Overload for convenience when using Create DTO mapping
    public Request createRequestFromCreateDTO(Request request) {
        request.setStatus("Pending");
        request.setRequestDate(LocalDate.now());
        return requestRepository.save(request);
    }

    // Update request status (accept/reject)
    public Request updateRequestStatus(Long id, String newStatus) {
        Request request = getRequestById(id);
        request.setStatus(newStatus);
        return requestRepository.save(request);
    }

    // Delete a request
    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }

    // Cancel a request (only if Pending and by the requester)
    public void cancelRequest(Long id, String requesterName) {
        Request request = getRequestById(id);
        
        // Verify the requester owns this request
        if (!request.getRequesterName().equals(requesterName)) {
            throw new RuntimeException("You can only cancel your own requests");
        }
        
        // Only allow canceling pending requests
        if (!"Pending".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException("Only pending requests can be cancelled");
        }
        
        requestRepository.deleteById(id);
    }

    // Get requests by requester name
    public List<Request> getRequestsByRequesterName(String requesterName) {
        return requestRepository.findByRequesterNameContainingIgnoreCase(requesterName);
    }

    // ✅ Accept a request and create a WasteListing
    @Transactional
    public WasteListing acceptRequest(Long requestId, Long agentId) {
        return acceptRequest(requestId, agentId, null);
    }

    // Overload supporting description from related listing
    @Transactional
    public WasteListing acceptRequest(Long requestId, Long agentId, Long relatedListingId) {
        Request request = getRequestById(requestId);

        if (!"Pending".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException("Request already processed");
        }

        // Parse quantity string like "280 kg"
        BigDecimal quantity = parseQuantity(request.getQuantity());
        WasteListing.Unit unit = extractUnit(request.getQuantity());

        // Create farmer requester entity from request data
        Requester farmer = Requester.builder()
                .name(request.getRequesterName())
                .location(request.getRequesterLocation())
                .rating(request.getFarmRating() != null ? request.getFarmRating().doubleValue() : null)
                .role(Requester.Role.FARMER)
                .build();
        requesterRepository.save(farmer);

        // Determine description priority:
        // 1) request.description, 2) related listing description, 3) default fallback
        String description = (request.getDescription() != null && !request.getDescription().isBlank())
                ? request.getDescription().trim()
                : null;
        if (description == null && relatedListingId != null) {
            description = wasteListingRepository.findById(relatedListingId)
                    .map(WasteListing::getDescription)
                    .orElse(null);
        }
        if (description == null || description.isBlank()) {
            description = "From request " + request.getId();
        }

        WasteListing listing = WasteListing.builder()
                .wasteType(request.getWasteType())
                .description(description)
                .quantity(quantity)
                .unit(unit)
                .timeSlot(request.getPreferredPickupTime())
                .pricePerUnit(request.getOfferedPrice())
                .availableFrom(LocalDate.now())
                .expiresOn(LocalDate.now().plusDays(7)) // business rule
                .status("ACCEPTED")
                .requester(farmer)   // farmer info
                .acceptedBy(agentId) // warehouse owner ID (no FK constraint)
                .build();

        wasteListingRepository.save(listing);

        request.setStatus("Accepted");
        request.setAcceptedByAgentId(agentId);
        // You can add agent name lookup here if needed
        requestRepository.save(request);

        return listing;
    }

    private BigDecimal parseQuantity(String quantityStr) {
        if (quantityStr == null) return BigDecimal.ZERO;
        String[] parts = quantityStr.split(" ");
        return new BigDecimal(parts[0]);
    }

    private WasteListing.Unit extractUnit(String quantityStr) {
        if (quantityStr == null) return WasteListing.Unit.KG;
        String[] parts = quantityStr.split(" ");
        return WasteListing.Unit.valueOf(parts[1].toUpperCase());
    }
}
