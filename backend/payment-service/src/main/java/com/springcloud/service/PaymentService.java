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
    
    // Get Wallet Info with Payment History
    public WalletInfo getWalletInfo(Long userId) {
        Wallet wallet = getOrCreateWallet(userId);
        List<TransactionHistory> history = getTransactionHistory(userId);
        
        return new WalletInfo(
            wallet.getUserId(),
            wallet.getBalance(),
            wallet.getEscrowedAmount(),
            wallet.getStatus(),
            history
        );
    }
    
    // Transaction History
    public List<TransactionHistory> getTransactionHistory(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByTimestampDesc(userId);
        return transactions.stream()
            .map(this::mapToTransactionHistory)
            .collect(Collectors.toList());
    }
    
    // Create Payment Record (for PayHere initiation)
    @Transactional
    public Payment createPaymentRecord(PaymentInitiationRequest request) {
        String paymentId = UUID.randomUUID().toString();
        
        Payment payment = new Payment(
            paymentId,
            request.payerId(),
            request.amount(),
            PaymentType.PAYHERE,
            request.reference()
        );
        payment.setRecipientId(request.payeeId());
        payment.setDescription(request.description());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setEscrowPercentage(request.escrowPercentage());
        
        return paymentRepository.save(payment);
    }
    
    // Process Payment Notification (from PayHere webhook)
    @Transactional
    public void processPaymentNotification(String orderId, String statusCode, BigDecimal amount) {
        Payment payment = paymentRepository.findByReference(orderId)
            .orElseThrow(() -> new RuntimeException("Payment not found: " + orderId));
        
        PaymentStatus newStatus = mapPayHereStatusToPaymentStatus(statusCode);
        payment.setStatus(newStatus);
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);
        
        // If payment is successful, split amount between escrow and direct credit
        if ("2".equals(statusCode)) { // Success
            BigDecimal escrowPercentage = payment.getEscrowPercentage() != null ? 
                payment.getEscrowPercentage() : BigDecimal.ZERO;
            
            BigDecimal escrowAmount = amount.multiply(escrowPercentage.divide(BigDecimal.valueOf(100)));
            BigDecimal directAmount = amount.subtract(escrowAmount);
            
            // Get or create payee wallet
            Wallet payeeWallet = getOrCreateWallet(payment.getRecipientId());
            
            // Add escrow amount to payee's escrow
            if (escrowAmount.compareTo(BigDecimal.ZERO) > 0) {
                payeeWallet.addToEscrow(escrowAmount);
                
                // Create escrow transaction
                createTransaction(
                    payment.getRecipientId(),
                    escrowAmount,
                    TransactionType.ESCROW,
                    payment.getReference(),
                    "Escrowed from PayHere payment: " + payment.getDescription()
                );
            }
            
            // Add remaining amount directly to payee's balance
            if (directAmount.compareTo(BigDecimal.ZERO) > 0) {
                payeeWallet.addToBalance(directAmount);
                
                // Create credit transaction
                createTransaction(
                    payment.getRecipientId(),
                    directAmount,
                    TransactionType.CREDIT,
                    payment.getReference(),
                    "Direct credit from PayHere payment: " + payment.getDescription()
                );
            }
            
            walletRepository.save(payeeWallet);
        }
    }
    
    // Release Escrow Amount
    @Transactional
    public PaymentResponse releaseEscrow(EscrowReleaseRequest request) {
        try {
            // Find payment by reference
            Payment payment = paymentRepository.findByReference(request.reference())
                .orElseThrow(() -> new RuntimeException("Payment not found"));
            
            // Calculate escrow amount
            BigDecimal escrowPercentage = payment.getEscrowPercentage() != null ? 
                payment.getEscrowPercentage() : BigDecimal.ZERO;
            BigDecimal escrowAmount = payment.getAmount().multiply(escrowPercentage.divide(BigDecimal.valueOf(100)));
            
            if (escrowAmount.compareTo(BigDecimal.ZERO) <= 0) {
                return new PaymentResponse(
                    "FAILED",
                    "No escrow amount to release",
                    null,
                    payment.getPaymentId()
                );
            }
            
            // Get payee wallet
            Wallet payeeWallet = getOrCreateWallet(request.payeeId());
            
            // Check if sufficient escrow amount exists
            if (payeeWallet.getEscrowedAmount().compareTo(escrowAmount) < 0) {
                return new PaymentResponse(
                    "FAILED",
                    "Insufficient escrow amount",
                    null,
                    payment.getPaymentId()
                );
            }
            
            // Move from escrow to balance
            payeeWallet.subtractFromEscrow(escrowAmount);
            payeeWallet.addToBalance(escrowAmount);
            walletRepository.save(payeeWallet);
            
            // Create transaction record
            createTransaction(
                request.payeeId(),
                escrowAmount,
                TransactionType.RELEASE,
                request.reference(),
                "Escrow released to wallet balance"
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
    
    // Refund Escrow Amount
    @Transactional
    public PaymentResponse refundEscrow(EscrowRefundRequest request) {
        try {
            // Find payment by reference
            Payment payment = paymentRepository.findByReference(request.reference())
                .orElseThrow(() -> new RuntimeException("Payment not found"));
            
            // Calculate escrow amount
            BigDecimal escrowPercentage = payment.getEscrowPercentage() != null ? 
                payment.getEscrowPercentage() : BigDecimal.ZERO;
            BigDecimal escrowAmount = payment.getAmount().multiply(escrowPercentage.divide(BigDecimal.valueOf(100)));
            
            if (escrowAmount.compareTo(BigDecimal.ZERO) <= 0) {
                return new PaymentResponse(
                    "FAILED",
                    "No escrow amount to refund",
                    null,
                    payment.getPaymentId()
                );
            }
            
            // Get wallets
            Wallet payeeWallet = getOrCreateWallet(request.payeeId());
            Wallet payerWallet = getOrCreateWallet(request.payerId());
            
            // Check if sufficient escrow amount exists
            if (payeeWallet.getEscrowedAmount().compareTo(escrowAmount) < 0) {
                return new PaymentResponse(
                    "FAILED",
                    "Insufficient escrow amount",
                    null,
                    payment.getPaymentId()
                );
            }
            
            // Remove from payee's escrow
            payeeWallet.subtractFromEscrow(escrowAmount);
            walletRepository.save(payeeWallet);
            
            // Add to payer's balance
            payerWallet.addToBalance(escrowAmount);
            walletRepository.save(payerWallet);
            
            // Create transaction records
            createTransaction(
                request.payeeId(),
                escrowAmount,
                TransactionType.DEBIT,
                request.reference(),
                "Escrow refunded to payer"
            );
            
            createTransaction(
                request.payerId(),
                escrowAmount,
                TransactionType.REFUND,
                request.reference(),
                "Escrow refund received"
            );
            
            return new PaymentResponse(
                "SUCCESS",
                "Escrow refunded successfully",
                UUID.randomUUID().toString(),
                payment.getPaymentId()
            );
            
        } catch (Exception e) {
            return new PaymentResponse(
                "FAILED",
                "Escrow refund failed: " + e.getMessage(),
                null,
                null
            );
        }
    }
    
    // Withdraw to Bank (excluding escrow amount)
    @Transactional
    public WithdrawalResponse withdrawToBank(WithdrawalRequest request) {
        try {
            Wallet wallet = getOrCreateWallet(request.userId());
            
            // Check if user has sufficient balance (excluding escrow)
            if (wallet.getBalance().compareTo(request.amount()) < 0) {
                return new WithdrawalResponse(
                    null,
                    request.userId(),
                    request.amount(),
                    "FAILED",
                    "Insufficient balance (excluding escrow amount)"
                );
            }
            
            // Check if bank details exist
            BankDetails bankDetails = bankDetailsRepository.findByUserId(request.userId())
                .orElseThrow(() -> new RuntimeException("Bank details not found"));
            
            // Deduct from wallet balance only
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
    
    // Get Payment Statistics (Admin/Moderator)
    public PaymentStatistics getPaymentStatistics() {
        List<Payment> allPayments = paymentRepository.findAll();
        List<Transaction> allTransactions = transactionRepository.findAll();
        List<Wallet> allWallets = walletRepository.findAll();
        
        BigDecimal totalAmount = allPayments.stream()
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalRevenue = allPayments.stream()
            .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        int transactionCount = allTransactions.size();
        
        BigDecimal totalEscrowAmount = allWallets.stream()
            .map(Wallet::getEscrowedAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long successfulPayments = allPayments.stream()
            .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
            .count();
        
        long failedPayments = allPayments.stream()
            .filter(p -> p.getStatus() == PaymentStatus.FAILED)
            .count();
        
        long pendingPayments = allPayments.stream()
            .filter(p -> p.getStatus() == PaymentStatus.PENDING)
            .count();
        
        BigDecimal totalWithdrawals = allTransactions.stream()
            .filter(t -> t.getType() == TransactionType.WITHDRAWAL)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new PaymentStatistics(
            totalAmount,
            totalRevenue,
            transactionCount,
            totalEscrowAmount,
            (int) successfulPayments,
            (int) failedPayments,
            (int) pendingPayments,
            totalWithdrawals
        );
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
}
