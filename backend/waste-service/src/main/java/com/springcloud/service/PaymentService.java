package com.springcloud.service;

import com.springcloud.dto.PaymentDTO;
import com.springcloud.dto.PaymentInitiationRequest;
import com.springcloud.dto.PayHerePaymentResponse;
import com.springcloud.model.Payment;
import com.springcloud.model.WasteListing;
import com.springcloud.repository.PaymentRepository;
import com.springcloud.repository.WasteListingRepository;
import com.springcloud.client.PaymentServiceClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final WasteListingRepository wasteListingRepository;
    private final PaymentServiceClient paymentServiceClient;

    public PaymentService(PaymentRepository paymentRepository,
                          WasteListingRepository wasteListingRepository,
                          PaymentServiceClient paymentServiceClient) {
        this.paymentRepository = paymentRepository;
        this.wasteListingRepository = wasteListingRepository;
        this.paymentServiceClient = paymentServiceClient;
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

    /**
     * Initiate PayHere payment for a waste payout. 
     * Escrow 100%, type WASTE.
     */
    public PayHerePaymentResponse initiateWastePayment(Long agentId, Long paymentId) {
        // Get the payment record
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + paymentId));

        // Verify the agent owns this payment
        if (!payment.getAgentId().equals(agentId)) {
            throw new SecurityException("You are not authorized to make this payment");
        }

        // Only allow payment if status is PENDING
        if (!"PENDING".equalsIgnoreCase(payment.getStatus())) {
            throw new IllegalStateException("Payment is not in a payable state. Current status: " + payment.getStatus());
        }

        // Get waste listing for additional context
        WasteListing listing = wasteListingRepository.findById(payment.getWasteListingId())
                .orElseThrow(() -> new RuntimeException("Waste listing not found"));

        // Prepare payment initiation request
        // Agent (payerId) pays the farmer (payeeId)
        PaymentInitiationRequest paymentInitRequest = new PaymentInitiationRequest(
            payment.getId().toString(), // reference
            payment.getGrossAmount().doubleValue(), // amount
            payment.getAgentId(), // payerId (waste agent)
            payment.getRequesterId(), // payeeId (farmer/requester)
            "WASTE", // paymentType
            100.0, // escrowPercentage - 100% goes to escrow
            "Waste payment for listing #" + listing.getId() + " - " + listing.getWasteType()
        );

        System.out.println("Initiating waste payment: " + paymentInitRequest);

        // Call payment-service via Feign client
        PayHerePaymentResponse response = paymentServiceClient.initiatePayment(paymentInitRequest);

        System.out.println("Payment initiation response: " + response.hash());

        // Return payment initiation response to client
        return response;
    }

}
