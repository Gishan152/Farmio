package com.springcloud.controller;

import com.springcloud.dto.*;
import com.springcloud.service.PaymentService;
import com.springcloud.service.PayHereService;
import com.springcloud.util.PayHereFormGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private PayHereService payHereService;
    
    @Autowired
    private PayHereFormGenerator payHereFormGenerator;
    
    // PayHere Integration Endpoints
    
    // Payment Initialization (called by order-service, transport-service, etc.)
    @PostMapping("/payhere/initiate")
    public ResponseEntity<PayHerePaymentResponse> initiatePayHerePayment(@RequestBody PaymentInitiationRequest request) {
        System.out.println("reference: " + request.reference());
        System.out.println("amount: " + request.amount());
        System.out.println("payerId: " + request.payerId());
        System.out.println("payeeId: " + request.payeeId());
        System.out.println("escrowPercentage: " + request.escrowPercentage());
        System.out.println("description: " + request.description());
        PayHerePaymentResponse response = payHereService.initiatePayment(request);
        return ResponseEntity.ok(response);
    }
    
    // PayHere Payment Notification Handler (Webhook)
    @PostMapping("/payhere/notify")
    public ResponseEntity<String> handlePayHereNotification(
            @RequestParam("merchant_id") String merchantId,
            @RequestParam("order_id") String orderId,
            @RequestParam("payment_id") String paymentId,
            @RequestParam("payhere_amount") String payhereAmount,
            @RequestParam("payhere_currency") String payhereCurrency,
            @RequestParam("status_code") String statusCode,
            @RequestParam("md5sig") String md5sig,
            @RequestParam(value = "custom_1", required = false) String custom1,
            @RequestParam(value = "custom_2", required = false) String custom2,
            @RequestParam(value = "method", required = false) String method,
            @RequestParam(value = "status_message", required = false) String statusMessage,
            @RequestParam(value = "card_holder_name", required = false) String cardHolderName,
            @RequestParam(value = "card_no", required = false) String cardNo,
            @RequestParam(value = "card_expiry", required = false) String cardExpiry) {

        System.out.println("Payment notification received");

        try {
            PayHereNotificationRequest notification = new PayHereNotificationRequest(
                merchantId,
                orderId,
                paymentId,
                new java.math.BigDecimal(payhereAmount),
                payhereCurrency,
                statusCode,
                md5sig,
                custom1,
                custom2,
                method,
                statusMessage,
                cardHolderName,
                cardNo,
                cardExpiry
            );
            
            payHereService.handlePaymentNotification(notification);
            return ResponseEntity.ok("OK");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("ERROR: " + e.getMessage());
        }
    }
    
    // Escrow Management Endpoints
    
    // Release Escrow Amount
    @PostMapping("/release-escrow")
    public ResponseEntity<PaymentResponse> releaseEscrow(@RequestBody EscrowReleaseRequest request) {
        PaymentResponse response = paymentService.releaseEscrow(request);
        return ResponseEntity.ok(response);
    }
    
    // Refund Escrow Amount
    @PostMapping("/refund-escrow")
    public ResponseEntity<PaymentResponse> refundEscrow(@RequestBody EscrowRefundRequest request) {
        PaymentResponse response = paymentService.refundEscrow(request);
        return ResponseEntity.ok(response);
    }
    
    // Wallet Management Endpoints
    
    // Get Wallet Info (including payment history)
    @GetMapping("/wallet/{userId}")
    public ResponseEntity<WalletInfo> getWalletInfo(@PathVariable Long userId) {
        WalletInfo walletInfo = paymentService.getWalletInfo(userId);
        return ResponseEntity.ok(walletInfo);
    }
    
    // Withdraw Wallet Amount (excluding escrow)
    @PostMapping("/withdraw")
    public ResponseEntity<WithdrawalResponse> withdrawToBank(@RequestBody WithdrawalRequest request) {
        WithdrawalResponse response = paymentService.withdrawToBank(request);
        return ResponseEntity.ok(response);
    }
    
    // Bank Details Management
    
    @PostMapping("/bank-details")
    public ResponseEntity<Void> addOrUpdateBankDetails(@RequestBody BankDetailsRequest request) {
        paymentService.addOrUpdateBankDetails(request);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/bank-details/{userId}")
    public ResponseEntity<BankDetailsResponse> getBankDetails(@PathVariable Long userId) {
        BankDetailsResponse response = paymentService.getBankDetails(userId);
        return ResponseEntity.ok(response);
    }
    
    // Admin/Moderator Endpoints
    
    // Get Payment Statistics
    @GetMapping("/statistics")
    public ResponseEntity<PaymentStatistics> getPaymentStatistics() {
        PaymentStatistics statistics = paymentService.getPaymentStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    // Additional endpoints for transaction history
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<TransactionHistory>> getTransactionHistory(@PathVariable Long userId) {
        List<TransactionHistory> history = paymentService.getTransactionHistory(userId);
        return ResponseEntity.ok(history);
    }

    // Check Payment Status by Reference
    @GetMapping("/status/{reference}")
    public ResponseEntity<?> getPaymentStatusByReference(@PathVariable String reference) {
        try {
            var payment = paymentService.getPaymentByReference(reference);
            if (payment == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(payment.getStatus().toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("ERROR: " + e.getMessage());
        }
    }
}
