package com.springcloud.controller;

import com.springcloud.dto.PayHerePaymentResponse;
import com.springcloud.dto.PaymentDTO;
import com.springcloud.mapper.PaymentMapper;
import com.springcloud.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waste/payments")
//@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentMapper paymentMapper;

    public PaymentController(PaymentService paymentService, PaymentMapper paymentMapper) {
        this.paymentService = paymentService;
        this.paymentMapper = paymentMapper;
    }

    // @GetMapping
    // public List<PaymentDTO> getAllPayments() {
    //     return paymentService.getAllPaymentDTOs();
    // }

    // Return payments related to the current agent (X-User-Id)
    @GetMapping
    public List<PaymentDTO> getMyPayments(@RequestHeader("X-User-Id") String userId) {
        Long agentId = Long.valueOf(userId);
        return paymentService.getPaymentDTOsByAgentId(agentId);
    }

    @GetMapping("/{id}")
    public PaymentDTO getPaymentById(@PathVariable Long id) {
        return paymentMapper.toDTO(paymentService.getPaymentById(id));
    }

    @PutMapping("/{id}/status")
    public PaymentDTO updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String method,
            @RequestParam(required = false) String transactionRef
    ) {
        return paymentMapper.toDTO(paymentService.updatePaymentStatus(id, status, method, transactionRef));
    }

    /**
     * Initiate PayHere payment for a waste payout. Escrow 100%, type WASTE.
     */
    @PostMapping("/{id}/pay")
    public PayHerePaymentResponse initiatePay(@RequestHeader("X-User-Id") String userId,
                                              @PathVariable("id") Long paymentId) {
        Long agentId = Long.valueOf(userId);
        return paymentService.initiateWastePayment(agentId, paymentId);
    }
}