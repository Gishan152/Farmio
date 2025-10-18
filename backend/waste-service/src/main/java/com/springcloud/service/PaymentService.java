package com.springcloud.service;

import com.springcloud.dto.PaymentDTO;
import com.springcloud.model.Payment;
import com.springcloud.model.WasteListing;
import com.springcloud.repository.PaymentRepository;
import com.springcloud.repository.WasteListingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final WasteListingRepository wasteListingRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          WasteListingRepository wasteListingRepository) {
        this.paymentRepository = paymentRepository;
        this.wasteListingRepository = wasteListingRepository;
    }

    // Return enriched DTOs for frontend
    public List<PaymentDTO> getAllPaymentDTOs() {
        return paymentRepository.findAll()
                .stream()
                .map(payment -> {
                    WasteListing listing = wasteListingRepository.findById(payment.getWasteListingId())
                            .orElse(null);

                    PaymentDTO dto = new PaymentDTO();
                    dto.setId(payment.getId());
                    dto.setWasteListingId(payment.getWasteListingId());
                    dto.setRequesterId(payment.getRequesterId());
                    dto.setAgentId(payment.getAgentId());
                    dto.setQuantity(payment.getQuantity());
                    dto.setUnit(payment.getUnit());
                    dto.setPricePerUnit(payment.getPricePerUnit());
                    dto.setGrossAmount(payment.getGrossAmount());
                    dto.setStatus(payment.getStatus());
                    dto.setPaymentMethod(payment.getPaymentMethod());
                    dto.setTransactionRef(payment.getTransactionRef());
                    dto.setCreatedAt(payment.getCreatedAt());
                    dto.setUpdatedAt(payment.getUpdatedAt());

                    // ✅ Populate extra fields
                    dto.setPaymentDate(payment.getCreatedAt());
                    if (listing != null && listing.getRequester() != null) {
                        dto.setFarmer(listing.getRequester().getName());
                        dto.setFarmerAccount(listing.getRequester().getAccountNumber());
                        dto.setWasteType(listing.getWasteType());
                    }
                    dto.setRate(payment.getPricePerUnit());

                    return dto;
                })
                .toList();
    }

    // New: filter by current agent (waste user) id
    public List<PaymentDTO> getPaymentDTOsByAgentId(Long agentId) {
        return paymentRepository.findByAgentId(agentId)
                .stream()
                .map(payment -> {
                    WasteListing listing = wasteListingRepository.findById(payment.getWasteListingId())
                            .orElse(null);

                    PaymentDTO dto = new PaymentDTO();
                    dto.setId(payment.getId());
                    dto.setWasteListingId(payment.getWasteListingId());
                    dto.setRequesterId(payment.getRequesterId());
                    dto.setAgentId(payment.getAgentId());
                    dto.setQuantity(payment.getQuantity());
                    dto.setUnit(payment.getUnit());
                    dto.setPricePerUnit(payment.getPricePerUnit());
                    dto.setGrossAmount(payment.getGrossAmount());
                    dto.setStatus(payment.getStatus());
                    dto.setPaymentMethod(payment.getPaymentMethod());
                    dto.setTransactionRef(payment.getTransactionRef());
                    dto.setCreatedAt(payment.getCreatedAt());
                    dto.setUpdatedAt(payment.getUpdatedAt());

                    // Enrichment
                    dto.setPaymentDate(payment.getCreatedAt());
                    if (listing != null && listing.getRequester() != null) {
                        dto.setFarmer(listing.getRequester().getName());
                        dto.setFarmerAccount(listing.getRequester().getAccountNumber());
                        dto.setWasteType(listing.getWasteType());
                    }
                    dto.setRate(payment.getPricePerUnit());
                    return dto;
                })
                .toList();
    }
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + id));
    }

    public Payment updatePaymentStatus(Long id, String status, String method, String transactionRef) {
        Payment payment = getPaymentById(id);
        payment.setStatus(status);

        if (method != null) {
            payment.setPaymentMethod(method);
        }
        if (transactionRef != null) {
            payment.setTransactionRef(transactionRef);
        }

        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

}
