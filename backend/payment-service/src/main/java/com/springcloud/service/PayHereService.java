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
    private PaymentService paymentService;
    
    /**
     * Initiate PayHere payment from other services (order-service, transport-service)
     */
    public PayHerePaymentResponse initiatePayment(PaymentInitiationRequest request) {
        try {
            // Create payment record
            Payment payment = paymentService.createPaymentRecord(request);
            
            // Generate hash for PayHere
            String hash = generateHash(
                payHereConfig.getMerchantId(),
                request.reference(),
                request.amount(),
                "LKR"
            );
            
            return new PayHerePaymentResponse(
                "SUCCESS",
                "Payment initiated successfully",
                payHereConfig.getCheckoutUrl(),
                payment.getReference(), // orderId
                hash,
                payHereConfig.getMerchantId(), // merchantId
                "John", // firstName (hardcoded)
                "Doe", // lastName (hardcoded)
                "john.doe@example.com", // email (hardcoded)
                "+94123456789", // phone (hardcoded)
                "123 Main St", // address (hardcoded)
                "Colombo", // city (hardcoded)
                "Sri Lanka", // country (hardcoded)
                payment.getDescription(), // description
                "LKR", // currency (hardcoded as per usage)
                payment.getAmount().toString() // amount
            );
            
        } catch (Exception e) {
            return new PayHerePaymentResponse(
                "FAILED",
                "Payment initiation failed: " + e.getMessage(),
                null,
                request.reference(),
                null,
                payHereConfig.getMerchantId(),
                "John",
                "Doe",
                "john.doe@example.com",
                "+94123456789",
                "123 Main St",
                "Colombo",
                "Sri Lanka",
                null,
                "LKR",
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

            System.out.println("Notification signature is valid");
            
            // Process payment notification through main payment service
            paymentService.processPaymentNotification(
                notification.orderId(),
                notification.statusCode(),
                notification.payhereAmount()
            );
            
        } catch (Exception e) {
            // Log error - in production, you might want to use proper logging
            System.err.println("PayHere notification processing failed: " + e.getMessage());
        }
    }
    
    /**
     * Generate MD5 hash for PayHere payment
     */
    private String generateHash(String merchantId, String orderId, BigDecimal amount, String currency) {
        System.out.println("Generating hash for PayHere payment : " + merchantId + ", " + orderId + ", " + amount + ", " + currency);
        try {
            DecimalFormat df = new DecimalFormat("0.00");
            String amountFormatted = df.format(amount);
            System.out.println("Formatted amount: " + amountFormatted);
            System.out.println("Merchant secret: " + payHereConfig.getMerchantSecret());
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
}
