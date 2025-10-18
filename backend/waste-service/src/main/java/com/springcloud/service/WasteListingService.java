package com.springcloud.service;

import com.springcloud.model.Payment;
import com.springcloud.model.WasteListing;
import com.springcloud.repository.PaymentRepository;
import com.springcloud.repository.WasteListingRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class WasteListingService {

    private final WasteListingRepository wasteListingRepository;
    private final PaymentRepository paymentRepository;

    public WasteListingService(WasteListingRepository wasteListingRepository,
                               PaymentRepository paymentRepository) {
        this.wasteListingRepository = wasteListingRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<WasteListing> getAllWasteListings() {
        return wasteListingRepository.findAll();
    }

    public WasteListing getWasteListingById(Long id) {
        return wasteListingRepository.findById(id).orElse(null);
    }

    public WasteListing updateStatus(Long id, String newStatus) {
        WasteListing listing = wasteListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        listing.setStatus(newStatus);
        WasteListing saved = wasteListingRepository.save(listing);

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
}
