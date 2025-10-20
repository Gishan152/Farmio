package com.springcloud.service;

import com.springcloud.model.Payment;
import com.springcloud.model.Request;
import com.springcloud.model.WasteListing;
import com.springcloud.repository.PaymentRepository;
import com.springcloud.repository.RequestRepository;
import com.springcloud.repository.WasteListingRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class WasteListingService {

    private final WasteListingRepository wasteListingRepository;
    private final PaymentRepository paymentRepository;
    private final RequestRepository requestRepository;

    public WasteListingService(WasteListingRepository wasteListingRepository,
                               PaymentRepository paymentRepository,
                               RequestRepository requestRepository) {
        this.wasteListingRepository = wasteListingRepository;
        this.paymentRepository = paymentRepository;
        this.requestRepository = requestRepository;
    }

    public List<WasteListing> getAllWasteListings() {
        return wasteListingRepository.findAll();
    }

    public WasteListing getWasteListingById(Long id) {
        return wasteListingRepository.findById(id).orElse(null);
    }

    // New: fetch all listings accepted by the given agent (user)
    public List<WasteListing> getAllByAcceptedBy(Long acceptedBy) {
        return wasteListingRepository.findByAcceptedBy(acceptedBy);
    }

    public WasteListing updateStatus(Long id, String newStatus) {
        WasteListing listing = wasteListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        listing.setStatus(newStatus);
        WasteListing saved = wasteListingRepository.save(listing);

        // Sync status with the original Request if it exists
        syncRequestStatus(saved, newStatus);

        // If marked COMPLETED, create a payment record
        if ("COMPLETED".equalsIgnoreCase(newStatus)) {
            Payment payment = new Payment();
            payment.setWasteListingId(saved.getId());
            payment.setRequesterId(saved.getRequester().getId()); // assuming requester is an entity
            payment.setAgentId(saved.getAcceptedBy());
            payment.setQuantity(saved.getQuantity());
            payment.setUnit(saved.getUnit().toString());
            payment.setPricePerUnit(saved.getPricePerUnit());
            payment.setGrossAmount(saved.getQuantity().multiply(saved.getPricePerUnit()));
            payment.setStatus("PENDING");

            paymentRepository.save(payment);
        }

        return saved;
    }

    /**
     * Synchronizes Request status when WasteListing status changes
     * Maps WasteListing statuses to Request statuses
     */
    private void syncRequestStatus(WasteListing listing, String listingStatus) {
        // Find requests from the same requester with matching waste type and location
        // In a better implementation, you'd have a direct foreign key relationship
        List<Request> matchingRequests = requestRepository.findByRequesterNameContainingIgnoreCase(
            listing.getRequester().getName()
        );

        for (Request request : matchingRequests) {
            // Match by requester name, waste type, and accepted status
            if (request.getWasteType().equalsIgnoreCase(listing.getWasteType()) &&
                request.getAcceptedByAgentId() != null &&
                request.getAcceptedByAgentId().equals(listing.getAcceptedBy())) {
                
                String requestStatus = mapListingStatusToRequestStatus(listingStatus);
                request.setStatus(requestStatus);
                requestRepository.save(request);
                break; // Only update the first matching request
            }
        }
    }

    /**
     * Maps WasteListing status to Request status
     */
    private String mapListingStatusToRequestStatus(String listingStatus) {
        if (listingStatus == null) return "Pending";
        
        switch (listingStatus.toUpperCase()) {
            case "ACCEPTED":
                return "Accepted";
            case "IN_PROGRESS":
                return "In Progress";
            case "COMPLETED":
                return "Completed";
            default:
                return "Accepted"; // Default to accepted for any other status
        }
    }
}
