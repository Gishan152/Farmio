package com.springcloud.service;

import com.springcloud.config.PayHereConfig;
import com.springcloud.dto.*;
import com.springcloud.entity.*;
import com.springcloud.repository.*;
import com.springcloud.common.enums.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PayHereService {
    
    @Autowired
    private PayHereConfig payHereConfig;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private WalletRepository walletRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private PaymentService paymentService;
    
    /**
     * Initiate PayHere payment and generate checkout URL
     */
    public PayHerePaymentResponse initiatePayment(PayHerePaymentRequest request) {
        try {
            // Generate hash for PayHere
            String hash = generateHash(
                payHereConfig.getMerchantId(),
                request.orderId(),
                request.amount(),
                request.currency()
            );
            
            // Create pending payment record
            Payment payment = new Payment(
                request.orderId(),
                request.userId(),
                request.amount(),
                PaymentType.PAYHERE,
                request.orderId()
            );
            payment.setStatus(PaymentStatus.PENDING);
            payment.setDescription("PayHere payment for: " + request.items());
            paymentRepository.save(payment);
            
            return new PayHerePaymentResponse(
                "SUCCESS",
                "Payment initiated successfully",
                payHereConfig.getCheckoutUrl(),
                request.orderId(),
                hash
            );
            
        } catch (Exception e) {
            return new PayHerePaymentResponse(
                "FAILED",
                "Payment initiation failed: " + e.getMessage(),
                null,
                request.orderId(),
                null
            );
        }
    }
    
    /**
     * Handle PayHere payment notification
     */
    @Transactional
    public void handlePaymentNotification(PayHereNotificationRequest notification) {
        try {
            // Verify the payment notification
            if (!verifyPaymentNotification(notification)) {
                throw new RuntimeException("Invalid payment notification signature");
            }
            
            // Find the payment record
            Payment payment = paymentRepository.findByPaymentId(notification.orderId())
                .orElseThrow(() -> new RuntimeException("Payment not found: " + notification.orderId()));
            
            // Update payment status based on status code
            PaymentStatus newStatus = mapPayHereStatusToPaymentStatus(notification.statusCode());
            payment.setStatus(newStatus);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            
            // If payment is successful, add funds to user's wallet
            if ("2".equals(notification.statusCode())) { // Success
                addFundsToWallet(payment.getUserId(), payment.getAmount(), notification.orderId());
            }
            
            // Create transaction record
            createTransactionRecord(payment, notification);
            
        } catch (Exception e) {
            // Log error - in production, you might want to use proper logging
            System.err.println("PayHere notification processing failed: " + e.getMessage());
        }
    }
    
    /**
     * Generate MD5 hash for PayHere payment
     */
    private String generateHash(String merchantId, String orderId, BigDecimal amount, String currency) {
        try {
            DecimalFormat df = new DecimalFormat("0.00");
            String amountFormatted = df.format(amount);
            
            String hashedSecret = getMd5(payHereConfig.getMerchantSecret()).toUpperCase();
            String dataToHash = merchantId + orderId + amountFormatted + currency + hashedSecret;
            
            return getMd5(dataToHash).toUpperCase();
            
        } catch (Exception e) {
            throw new RuntimeException("Hash generation failed", e);
        }
    }
    
    /**
     * Verify PayHere payment notification
     */
    private boolean verifyPaymentNotification(PayHereNotificationRequest notification) {
        try {
            String hashedSecret = getMd5(payHereConfig.getMerchantSecret()).toUpperCase();
            
            DecimalFormat df = new DecimalFormat("0.00");
            String amountFormatted = df.format(notification.payhereAmount());
            
            String localHash = getMd5(
                notification.merchantId() +
                notification.orderId() +
                amountFormatted +
                notification.payhereCurrency() +
                notification.statusCode() +
                hashedSecret
            ).toUpperCase();
            
            return localHash.equals(notification.md5sig());
            
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Generate MD5 hash
     */
    private String getMd5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : messageDigest) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
            
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not available", e);
        }
    }
    
    /**
     * Map PayHere status code to internal payment status
     */
    private PaymentStatus mapPayHereStatusToPaymentStatus(String statusCode) {
        return switch (statusCode) {
            case "2" -> PaymentStatus.COMPLETED;
            case "0" -> PaymentStatus.PENDING;
            case "-1" -> PaymentStatus.CANCELLED;
            case "-2" -> PaymentStatus.FAILED;
            case "-3" -> PaymentStatus.REFUNDED;
            default -> PaymentStatus.FAILED;
        };
    }
    
    /**
     * Add funds to user's wallet
     */
    private void addFundsToWallet(Long userId, BigDecimal amount, String reference) {
        // Get or create wallet
        Wallet wallet = walletRepository.findByUserId(userId)
            .orElseGet(() -> {
                Wallet newWallet = new Wallet(userId);
                return walletRepository.save(newWallet);
            });
        
        // Add funds to wallet
        wallet.addToBalance(amount);
        walletRepository.save(wallet);
        
        // Create transaction record
        Transaction transaction = new Transaction(
            UUID.randomUUID().toString(),
            userId,
            amount,
            TransactionType.CREDIT,
            reference
        );
        transaction.setDescription("PayHere payment credited to wallet");
        transaction.setStatus("COMPLETED");
        transactionRepository.save(transaction);
    }
    
    /**
     * Create transaction record for PayHere payment
     */
    private void createTransactionRecord(Payment payment, PayHereNotificationRequest notification) {
        Transaction transaction = new Transaction(
            UUID.randomUUID().toString(),
            payment.getUserId(),
            notification.payhereAmount(),
            TransactionType.PAYMENT,
            notification.orderId()
        );
        
        transaction.setDescription("PayHere payment - " + notification.statusMessage());
        transaction.setStatus(mapPayHereStatusToTransactionStatus(notification.statusCode()));
        transactionRepository.save(transaction);
    }
    
    /**
     * Map PayHere status to transaction status
     */
    private String mapPayHereStatusToTransactionStatus(String statusCode) {
        return switch (statusCode) {
            case "2" -> "COMPLETED";
            case "0" -> "PENDING";
            case "-1" -> "CANCELLED";
            case "-2" -> "FAILED";
            case "-3" -> "REFUNDED";
            default -> "FAILED";
        };
    }
}
