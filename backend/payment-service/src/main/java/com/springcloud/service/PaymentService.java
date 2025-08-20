package com.springcloud.service;

import com.springcloud.dto.*;
import com.springcloud.entity.*;
import com.springcloud.repository.*;
import com.springcloud.common.enums.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private WalletRepository walletRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private BankDetailsRepository bankDetailsRepository;
    
    // Wallet Info
    public WalletInfo getWalletInfo(Long userId) {
        Wallet wallet = getOrCreateWallet(userId);
        return new WalletInfo(
            wallet.getUserId(),
            wallet.getBalance(),
            wallet.getEscrowedAmount(),
            wallet.getStatus()
        );
    }
    
    // Transaction History
    public List<TransactionHistory> getTransactionHistory(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByTimestampDesc(userId);
        return transactions.stream()
            .map(this::mapToTransactionHistory)
            .collect(Collectors.toList());
    }
    
    // Make a Payment
    @Transactional
    public PaymentResponse makePayment(PaymentRequest request) {
        try {
            // Generate payment ID
            String paymentId = UUID.randomUUID().toString();
            
            // Create payment record
            Payment payment = new Payment(
                paymentId,
                request.userId(),
                request.amount(),
                PaymentType.valueOf(request.type().toUpperCase()),
                request.reference()
            );
            payment.setRecipientId(request.recipientId());
            payment.setDescription(request.description());
            payment.setStatus(PaymentStatus.COMPLETED);
            
            paymentRepository.save(payment);
            
            // Update recipient wallet if specified
            if (request.recipientId() != null) {
                Wallet recipientWallet = getOrCreateWallet(request.recipientId());
                recipientWallet.addToBalance(request.amount());
                walletRepository.save(recipientWallet);
                
                // Create transaction record for recipient
                createTransaction(
                    request.recipientId(),
                    request.amount(),
                    TransactionType.CREDIT,
                    request.reference(),
                    "Payment received: " + request.description()
                );
            }
            
            return new PaymentResponse(
                "SUCCESS",
                "Payment completed successfully",
                UUID.randomUUID().toString(),
                paymentId
            );
            
        } catch (Exception e) {
            return new PaymentResponse(
                "FAILED",
                "Payment failed: " + e.getMessage(),
                null,
                null
            );
        }
    }
    
    // Escrow Funds
    @Transactional
    public PaymentResponse escrowFunds(PaymentRequest request) {
        try {
            Wallet payerWallet = getOrCreateWallet(request.userId());
            
            // Check if user has sufficient balance
            if (payerWallet.getBalance().compareTo(request.amount()) < 0) {
                return new PaymentResponse(
                    "FAILED",
                    "Insufficient balance",
                    null,
                    null
                );
            }
            
            // Move funds from balance to escrow
            payerWallet.subtractFromBalance(request.amount());
            payerWallet.addToEscrow(request.amount());
            walletRepository.save(payerWallet);
            
            // Create payment record
            String paymentId = UUID.randomUUID().toString();
            Payment payment = new Payment(
                paymentId,
                request.userId(),
                request.amount(),
                PaymentType.valueOf(request.type().toUpperCase()),
                request.reference()
            );
            payment.setRecipientId(request.recipientId());
            payment.setDescription(request.description());
            payment.setStatus(PaymentStatus.ESCROWED);
            paymentRepository.save(payment);
            
            // Create transaction record
            createTransaction(
                request.userId(),
                request.amount(),
                TransactionType.ESCROW,
                request.reference(),
                "Funds escrowed: " + request.description()
            );
            
            return new PaymentResponse(
                "SUCCESS",
                "Funds escrowed successfully",
                UUID.randomUUID().toString(),
                paymentId
            );
            
        } catch (Exception e) {
            return new PaymentResponse(
                "FAILED",
                "Escrow failed: " + e.getMessage(),
                null,
                null
            );
        }
    }
    
    // Release Escrowed Funds
    @Transactional
    public PaymentResponse releaseEscrow(PaymentRequest request) {
        try {
            // Find payment by reference
            Payment payment = paymentRepository.findByReference(request.reference())
                .orElseThrow(() -> new RuntimeException("Payment not found"));
            
            if (payment.getStatus() != PaymentStatus.ESCROWED) {
                return new PaymentResponse(
                    "FAILED",
                    "Payment is not in escrowed status",
                    null,
                    payment.getPaymentId()
                );
            }
            
            // Update payer wallet (remove from escrow)
            Wallet payerWallet = getOrCreateWallet(payment.getUserId());
            payerWallet.subtractFromEscrow(payment.getAmount());
            walletRepository.save(payerWallet);
            
            // Update recipient wallet (add to balance)
            if (payment.getRecipientId() != null) {
                Wallet recipientWallet = getOrCreateWallet(payment.getRecipientId());
                recipientWallet.addToBalance(payment.getAmount());
                walletRepository.save(recipientWallet);
                
                // Create transaction record for recipient
                createTransaction(
                    payment.getRecipientId(),
                    payment.getAmount(),
                    TransactionType.CREDIT,
                    payment.getReference(),
                    "Escrow released: " + payment.getDescription()
                );
            }
            
            // Update payment status
            payment.setStatus(PaymentStatus.RELEASED);
            paymentRepository.save(payment);
            
            // Create transaction record for payer
            createTransaction(
                payment.getUserId(),
                payment.getAmount(),
                TransactionType.RELEASE,
                payment.getReference(),
                "Escrow released: " + payment.getDescription()
            );
            
            return new PaymentResponse(
                "SUCCESS",
                "Escrow released successfully",
                UUID.randomUUID().toString(),
                payment.getPaymentId()
            );
            
        } catch (Exception e) {
            return new PaymentResponse(
                "FAILED",
                "Escrow release failed: " + e.getMessage(),
                null,
                null
            );
        }
    }
    
    // Refund Payment
    @Transactional
    public PaymentResponse refundPayment(PaymentRequest request) {
        try {
            // Find payment by reference
            Payment payment = paymentRepository.findByReference(request.reference())
                .orElseThrow(() -> new RuntimeException("Payment not found"));
            
            // Return funds to payer
            Wallet payerWallet = getOrCreateWallet(payment.getUserId());
            
            if (payment.getStatus() == PaymentStatus.ESCROWED) {
                // If escrowed, move from escrow to balance
                payerWallet.subtractFromEscrow(payment.getAmount());
                payerWallet.addToBalance(payment.getAmount());
            } else if (payment.getStatus() == PaymentStatus.COMPLETED || payment.getStatus() == PaymentStatus.RELEASED) {
                // If completed, add to balance and deduct from recipient if applicable
                payerWallet.addToBalance(payment.getAmount());
                
                if (payment.getRecipientId() != null) {
                    Wallet recipientWallet = getOrCreateWallet(payment.getRecipientId());
                    recipientWallet.subtractFromBalance(payment.getAmount());
                    walletRepository.save(recipientWallet);
                    
                    // Create transaction record for recipient
                    createTransaction(
                        payment.getRecipientId(),
                        payment.getAmount(),
                        TransactionType.DEBIT,
                        payment.getReference(),
                        "Payment refunded: " + payment.getDescription()
                    );
                }
            }
            
            walletRepository.save(payerWallet);
            
            // Update payment status
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
            
            // Create transaction record
            createTransaction(
                payment.getUserId(),
                payment.getAmount(),
                TransactionType.REFUND,
                payment.getReference(),
                "Payment refunded: " + payment.getDescription()
            );
            
            return new PaymentResponse(
                "SUCCESS",
                "Payment refunded successfully",
                UUID.randomUUID().toString(),
                payment.getPaymentId()
            );
            
        } catch (Exception e) {
            return new PaymentResponse(
                "FAILED",
                "Refund failed: " + e.getMessage(),
                null,
                null
            );
        }
    }
    
    // Get Payment Details
    public PaymentResponse getPaymentDetails(String reference) {
        try {
            Payment payment = paymentRepository.findByReference(reference)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
            
            return new PaymentResponse(
                payment.getStatus().toString(),
                "Payment details retrieved",
                null,
                payment.getPaymentId()
            );
            
        } catch (Exception e) {
            return new PaymentResponse(
                "FAILED",
                "Payment not found: " + e.getMessage(),
                null,
                null
            );
        }
    }
    
    // Bank Details
    public void addOrUpdateBankDetails(BankDetailsRequest request) {
        BankDetails bankDetails = bankDetailsRepository.findByUserId(request.userId())
            .orElse(new BankDetails());
        
        bankDetails.setUserId(request.userId());
        bankDetails.setBank(request.bank());
        bankDetails.setBranch(request.branch());
        bankDetails.setAccountNumber(request.accountNumber());
        bankDetails.setAccountHolderName(request.accountHolderName());
        bankDetails.setSwiftCode(request.swiftCode());
        
        bankDetailsRepository.save(bankDetails);
    }
    
    public BankDetailsResponse getBankDetails(Long userId) {
        BankDetails bankDetails = bankDetailsRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Bank details not found"));
        
        return new BankDetailsResponse(
            bankDetails.getUserId(),
            bankDetails.getBank(),
            bankDetails.getBranch(),
            bankDetails.getAccountNumber(),
            bankDetails.getAccountHolderName(),
            bankDetails.getSwiftCode(),
            bankDetails.getStatus()
        );
    }
    
    // Withdraw to Bank
    @Transactional
    public WithdrawalResponse withdrawToBank(WithdrawalRequest request) {
        try {
            Wallet wallet = getOrCreateWallet(request.userId());
            
            // Check if user has sufficient balance
            if (wallet.getBalance().compareTo(request.amount()) < 0) {
                return new WithdrawalResponse(
                    null,
                    request.userId(),
                    request.amount(),
                    "FAILED",
                    "Insufficient balance"
                );
            }
            
            // Check if bank details exist
            BankDetails bankDetails = bankDetailsRepository.findByUserId(request.userId())
                .orElseThrow(() -> new RuntimeException("Bank details not found"));
            
            // Deduct from wallet
            wallet.subtractFromBalance(request.amount());
            walletRepository.save(wallet);
            
            // Create transaction record
            String withdrawalId = UUID.randomUUID().toString();
            createTransaction(
                request.userId(),
                request.amount(),
                TransactionType.WITHDRAWAL,
                withdrawalId,
                "Withdrawal to bank: " + request.description()
            );
            
            return new WithdrawalResponse(
                withdrawalId,
                request.userId(),
                request.amount(),
                "SUCCESS",
                "Withdrawal initiated successfully"
            );
            
        } catch (Exception e) {
            return new WithdrawalResponse(
                null,
                request.userId(),
                request.amount(),
                "FAILED",
                "Withdrawal failed: " + e.getMessage()
            );
        }
    }
    
    // Helper methods
    private Wallet getOrCreateWallet(Long userId) {
        return walletRepository.findByUserId(userId)
            .orElseGet(() -> {
                Wallet newWallet = new Wallet(userId);
                return walletRepository.save(newWallet);
            });
    }
    
    private void createTransaction(Long userId, BigDecimal amount, TransactionType type, String reference, String description) {
        Transaction transaction = new Transaction(
            UUID.randomUUID().toString(),
            userId,
            amount,
            type,
            reference
        );
        transaction.setDescription(description);
        transaction.setStatus("COMPLETED");
        transactionRepository.save(transaction);
    }
    
    private TransactionHistory mapToTransactionHistory(Transaction transaction) {
        return new TransactionHistory(
            transaction.getTransactionId(),
            transaction.getAmount(),
            transaction.getType().toString(),
            transaction.getStatus(),
            transaction.getReference(),
            transaction.getTimestamp(),
            transaction.getDescription()
        );
    }
}
