package com.springcloud.controller;

import com.springcloud.dto.*;
import com.springcloud.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
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
}
