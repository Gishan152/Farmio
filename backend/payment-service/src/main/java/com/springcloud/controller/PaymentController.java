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
    
    // Wallet Info
    @GetMapping("/wallet/{userId}")
    public ResponseEntity<WalletInfo> getWalletInfo(@PathVariable Long userId) {
        WalletInfo walletInfo = paymentService.getWalletInfo(userId);
        return ResponseEntity.ok(walletInfo);
    }
    
    // Transaction History
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<TransactionHistory>> getTransactionHistory(@PathVariable Long userId) {
        List<TransactionHistory> history = paymentService.getTransactionHistory(userId);
        return ResponseEntity.ok(history);
    }
    
    // Make a Payment
    @PostMapping("/pay")
    public ResponseEntity<PaymentResponse> makePayment(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.makePayment(request);
        return ResponseEntity.ok(response);
    }
    
    // Escrow Funds
    @PostMapping("/escrow")
    public ResponseEntity<PaymentResponse> escrowFunds(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.escrowFunds(request);
        return ResponseEntity.ok(response);
    }
    
    // Release Escrowed Funds
    @PostMapping("/release-escrow")
    public ResponseEntity<PaymentResponse> releaseEscrow(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.releaseEscrow(request);
        return ResponseEntity.ok(response);
    }
    
    // Refund Payment
    @PostMapping("/refund")
    public ResponseEntity<PaymentResponse> refundPayment(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.refundPayment(request);
        return ResponseEntity.ok(response);
    }
    
    // Get Payment Details
    @GetMapping("/details/{reference}")
    public ResponseEntity<PaymentResponse> getPaymentDetails(@PathVariable String reference) {
        PaymentResponse response = paymentService.getPaymentDetails(reference);
        return ResponseEntity.ok(response);
    }
    
    // Bank Details & Withdrawals
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
    
    @PostMapping("/withdraw")
    public ResponseEntity<WithdrawalResponse> withdrawToBank(@RequestBody WithdrawalRequest request) {
        WithdrawalResponse response = paymentService.withdrawToBank(request);
        return ResponseEntity.ok(response);
    }
    
    // PayHere Integration Endpoints
    
    // Initiate PayHere Payment
    @PostMapping("/payhere/initiate")
    public ResponseEntity<PayHerePaymentResponse> initiatePayHerePayment(@RequestBody PayHerePaymentRequest request) {
        PayHerePaymentResponse response = payHereService.initiatePayment(request);
        return ResponseEntity.ok(response);
    }
    
    // Generate PayHere Payment Form
    @PostMapping(value = "/payhere/form", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> generatePayHereForm(@RequestBody PayHerePaymentRequest request) {
        try {
            PayHerePaymentResponse initResponse = payHereService.initiatePayment(request);
            
            if ("SUCCESS".equals(initResponse.status())) {
                String form = payHereFormGenerator.generatePaymentForm(request, initResponse.hash());
                return ResponseEntity.ok(form);
            } else {
                return ResponseEntity.badRequest().body("<html><body><h3>Payment initiation failed: " + initResponse.message() + "</h3></body></html>");
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("<html><body><h3>Error: " + e.getMessage() + "</h3></body></html>");
        }
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
}
