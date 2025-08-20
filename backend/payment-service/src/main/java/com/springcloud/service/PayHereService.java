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
            
            // Create PayHere request
            PayHerePaymentRequest payHereRequest = new PayHerePaymentRequest(
                request.payerId(),
                request.reference(),
                request.description(),
                "LKR",
                request.amount(),
                request.firstName(),
                request.lastName(),
                request.email(),
                request.phone(),
                request.address(),
                request.city(),
                request.country(),
                request.returnUrl(),
                request.cancelUrl(),
                request.payerId().toString(), // custom1 - payer ID
                request.payeeId().toString()  // custom2 - payee ID
            );
            
            return new PayHerePaymentResponse(
                "SUCCESS",
                "Payment initiated successfully",
                payHereConfig.getCheckoutUrl(),
                request.reference(),
                hash
            );
            
        } catch (Exception e) {
            return new PayHerePaymentResponse(
                "FAILED",
                "Payment initiation failed: " + e.getMessage(),
                null,
                request.reference(),
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
}
