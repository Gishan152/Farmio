package com.springcloud.service;

import com.springcloud.dto.*;
import com.springcloud.entity.*;
import com.springcloud.repository.*;
import com.springcloud.common.enums.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    
    @Autowired
    private CommissionRepository commissionRepository;
    
    @Autowired
    private PaymentMessagePublisher paymentMessagePublisher;

    // Commission rate - 3%
    private static final BigDecimal COMMISSION_RATE = new BigDecimal("3.00");

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
        // Check if a payment with the same reference already exists
        Payment payment = paymentRepository.findByReference(request.reference())
            .map(existing -> {
                // If payment is already completed, return failure (do not allow new/updated payment)
                if (existing.getStatus() == PaymentStatus.COMPLETED) {
                    throw new IllegalStateException("A completed payment already exists for this reference");
                }
                // Update existing payment fields and reset status to PENDING
                existing.setPayerId(request.payerId());
                existing.setPayeeId(request.payeeId());
                existing.setAmount(request.amount());
                existing.setEscrowPercentage(request.escrowPercentage());
                existing.setType(parsePaymentType(request.paymentType()));
                existing.setStatus(PaymentStatus.PENDING);
                existing.setDescription(request.description());
                existing.setUpdatedAt(LocalDateTime.now());
                return existing;
            })
            .orElseGet(() -> Payment.builder()
                .payerId(request.payerId())
                .payeeId(request.payeeId())
                .amount(request.amount())
                .escrowPercentage(request.escrowPercentage())
                .type(parsePaymentType(request.paymentType()))
                .status(PaymentStatus.PENDING)
                .reference(request.reference())
                .description(request.description())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build()
            );

        return paymentRepository.save(payment);
    }
    
    // Process Payment Notification (from PayHere webhook)
    @Transactional
    public void processPaymentNotification(String orderId, String statusCode, BigDecimal amount) {
        Payment payment = paymentRepository.findByReference(orderId)
            .orElseThrow(() -> new RuntimeException("Payment not found: " + orderId));
        
        PaymentStatus newStatus = mapPayHereStatusToPaymentStatus(statusCode);
        System.out.println("Payhere status code: " + statusCode + ", mapped to: " + newStatus);
        payment.setStatus(newStatus);
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);
        
        // If payment is successful, deduct commission and split amount between escrow and direct credit
        if ("2".equals(statusCode)) { // Success
            // Calculate 3% commission
            BigDecimal commissionAmount = amount.multiply(COMMISSION_RATE)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal netAmount = amount.subtract(commissionAmount);
            
            // Record commission details
            Commission commission = Commission.builder()
                .paymentReference(payment.getReference())
                .paymentId(payment.getId())
                .originalAmount(amount)
                .commissionRate(COMMISSION_RATE)
                .commissionAmount(commissionAmount)
                .netAmount(netAmount)
                .payerId(payment.getPayerId())
                .payeeId(payment.getPayeeId())
                .description("Payment commission for transaction: " + payment.getDescription())
                .createdBy("SYSTEM")
                .build();
            commissionRepository.save(commission);
            
            // Calculate escrow and direct amounts from NET amount (after commission)
            BigDecimal escrowPercentage = payment.getEscrowPercentage() != null ? 
                payment.getEscrowPercentage() : BigDecimal.ZERO;
            BigDecimal escrowAmount = netAmount.multiply(escrowPercentage.divide(BigDecimal.valueOf(100)));
            BigDecimal directAmount = netAmount.subtract(escrowAmount);
            
            Wallet payeeWallet = getOrCreateWallet(payment.getPayeeId());
            
            if (escrowAmount.compareTo(BigDecimal.ZERO) > 0) {
                payeeWallet.addToEscrow(escrowAmount);
                createTransaction(
                    payment.getPayeeId(),
                    escrowAmount,
                    TransactionType.ESCROW,
                    payment.getReference(),
                    "Escrowed from PayHere payment (after 3% commission): " + payment.getDescription()
                );
            }
            
            if (directAmount.compareTo(BigDecimal.ZERO) > 0) {
                payeeWallet.addToBalance(directAmount);
                createTransaction(
                    payment.getPayeeId(),
                    directAmount,
                    TransactionType.CREDIT,
                    payment.getReference(),
                    "Direct credit from PayHere payment (after 3% commission): " + payment.getDescription()
                );
            }
            
            walletRepository.save(payeeWallet);
            
            // Create a transaction record for commission deduction for transparency
            createTransaction(
                payment.getPayeeId(),
                commissionAmount,
                TransactionType.DEBIT,
                payment.getReference(),
                "Platform commission (3%) deducted from payment: " + payment.getDescription()
            );
            
            // Publish payment confirmation message to RabbitMQ
            PaymentConfirmedMessage confirmationMessage = new PaymentConfirmedMessage(
                payment.getReference(),
                netAmount, // Send net amount after commission
                payment.getId().toString(),
                newStatus.toString(),
                LocalDateTime.now(),
                payment.getPayerId(),
                payment.getPayeeId()
            );
            paymentMessagePublisher.publishPaymentConfirmed(confirmationMessage);
        }
    }
    
    // Release Escrow Amount
    @Transactional
    public PaymentResponse releaseEscrow(EscrowReleaseRequest request) {
        try {
            // Find payment by reference
            Payment payment = paymentRepository.findByReference(request.reference())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

            // Only proceed if payment state is COMPLETED
            if (payment.getStatus() != PaymentStatus.COMPLETED) {
                return new PaymentResponse(
                    "FAILED",
                    "Payment is not completed. Current status: " + payment.getStatus(),
                    null,
                    payment.getId() != null ? payment.getId().toString() : null
                );
            }

            // Calculate escrow amount
            BigDecimal escrowPercentage = payment.getEscrowPercentage() != null ? 
                payment.getEscrowPercentage() : BigDecimal.ZERO;
            BigDecimal escrowAmount = payment.getAmount().multiply(escrowPercentage.divide(BigDecimal.valueOf(100)));
            
            if (escrowAmount.compareTo(BigDecimal.ZERO) <= 0) {
                return new PaymentResponse(
                    "FAILED",
                    "No escrow amount to release",
                    null,
                    payment.getId().toString()
                );
            }
            
            // Get payee wallet
            Wallet payeeWallet = getOrCreateWallet(payment.getPayeeId());
            
            // Check if sufficient escrow amount exists
            if (payeeWallet.getEscrowedAmount().compareTo(escrowAmount) < 0) {
                return new PaymentResponse(
                    "FAILED",
                    "Insufficient escrow amount",
                    null,
                    payment.getId().toString()
                );
            }
            
            // Move from escrow to balance
            payeeWallet.subtractFromEscrow(escrowAmount);
            payeeWallet.addToBalance(escrowAmount);
            walletRepository.save(payeeWallet);
            
            // Create transaction record
            createTransaction(
                payment.getPayeeId(),
                escrowAmount,
                TransactionType.RELEASE,
                request.reference(),
                "Escrow released to wallet balance"
            );
            
            return new PaymentResponse(
                "SUCCESS",
                "Escrow released successfully",
                UUID.randomUUID().toString(),
                payment.getId().toString()
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

            // Only proceed if payment state is COMPLETED
            if (payment.getStatus() != PaymentStatus.COMPLETED) {
                return new PaymentResponse(
                        "FAILED",
                        "Payment is not completed. Current status: " + payment.getStatus(),
                        null,
                        payment.getId() != null ? payment.getId().toString() : null
                );
            }

            // Calculate escrow amount
            BigDecimal escrowPercentage = payment.getEscrowPercentage() != null ? 
                payment.getEscrowPercentage() : BigDecimal.ZERO;
            BigDecimal escrowAmount = payment.getAmount().multiply(escrowPercentage.divide(BigDecimal.valueOf(100)));
            
            if (escrowAmount.compareTo(BigDecimal.ZERO) <= 0) {
                return new PaymentResponse(
                    "FAILED",
                    "No escrow amount to refund",
                    null,
                    payment.getId().toString()
                );
            }
            
            // Get wallets
            Wallet payeeWallet = getOrCreateWallet(payment.getPayeeId());
            Wallet payerWallet = getOrCreateWallet(payment.getPayerId());
            
            // Check if sufficient escrow amount exists
            if (payeeWallet.getEscrowedAmount().compareTo(escrowAmount) < 0) {
                return new PaymentResponse(
                    "FAILED",
                    "Insufficient escrow amount",
                    null,
                    payment.getId().toString()
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
                payment.getPayeeId(),
                escrowAmount,
                TransactionType.DEBIT,
                request.reference(),
                "Escrow refunded to payer"
            );
            
            createTransaction(
                payment.getPayerId(),
                escrowAmount,
                TransactionType.REFUND,
                request.reference(),
                "Escrow refund received"
            );
            
            return new PaymentResponse(
                "SUCCESS",
                "Escrow refunded successfully",
                UUID.randomUUID().toString(),
                payment.getId().toString()
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
    public WithdrawalResponse withdrawToBank(Long userId, WithdrawalRequest request) {
        try {
            Wallet wallet = getOrCreateWallet(userId);
            
            // Check if user has sufficient balance (excluding escrow)
            if (wallet.getBalance().compareTo(request.amount()) < 0) {
                return new WithdrawalResponse(
                    null,
                    userId,
                    request.amount(),
                    "FAILED",
                    "Insufficient balance (excluding escrow amount)"
                );
            }
            
            // Check if bank details exist
            BankDetails bankDetails = bankDetailsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Bank details not found"));
            
            // Deduct from wallet balance only
            wallet.subtractFromBalance(request.amount());
            walletRepository.save(wallet);
            
            // Create transaction record
            String withdrawalId = UUID.randomUUID().toString();
            createTransaction(
                userId,
                request.amount(),
                TransactionType.WITHDRAWAL,
                withdrawalId,
                "Withdrawal to bank: " + request.description()
            );
            
            return new WithdrawalResponse(
                withdrawalId,
                userId,
                request.amount(),
                "SUCCESS",
                "Withdrawal initiated successfully"
            );
            
        } catch (Exception e) {
            return new WithdrawalResponse(
                null,
                userId,
                request.amount(),
                "FAILED",
                "Withdrawal failed: " + e.getMessage()
            );
        }
    }
    
    // Get Payment Statistics (Admin/Moderator) - Updated to include commission data
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
    
    // Get Commission Summary (Admin/Moderator)
    public CommissionSummaryResponse getCommissionSummary() {
        BigDecimal totalCommissionAmount = commissionRepository.getTotalCommissionAmount();
        BigDecimal totalProcessedAmount = commissionRepository.getTotalProcessedAmount();
        Long totalTransactionCount = commissionRepository.getTotalCommissionCount();
        BigDecimal averageCommissionRate = commissionRepository.getAverageCommissionRate();
        
        // Get recent commissions (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Commission> recentCommissions = commissionRepository.findRecentCommissions(thirtyDaysAgo);
        
        List<CommissionDetailsResponse> recentCommissionResponses = recentCommissions.stream()
            .map(this::mapToCommissionDetailsResponse)
            .collect(Collectors.toList());
        
        return new CommissionSummaryResponse(
            totalCommissionAmount != null ? totalCommissionAmount : BigDecimal.ZERO,
            totalProcessedAmount != null ? totalProcessedAmount : BigDecimal.ZERO,
            totalTransactionCount != null ? totalTransactionCount : 0L,
            averageCommissionRate != null ? averageCommissionRate : BigDecimal.ZERO,
            recentCommissionResponses
        );
    }
    
    // Get Commission Details for a specific payment (Admin/Moderator)
    public CommissionDetailsResponse getCommissionByPaymentReference(String paymentReference) {
        Commission commission = commissionRepository.findByPaymentReference(paymentReference)
            .orElseThrow(() -> new RuntimeException("Commission record not found for payment: " + paymentReference));
        
        return mapToCommissionDetailsResponse(commission);
    }
    
    // Get Commission History (Admin/Moderator)
    public List<CommissionDetailsResponse> getCommissionHistory(LocalDateTime startDate, LocalDateTime endDate) {
        List<Commission> commissions = commissionRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate);
        
        return commissions.stream()
            .map(this::mapToCommissionDetailsResponse)
            .collect(Collectors.toList());
    }
    
    // Get Commission Statistics for a date range (Admin/Moderator)
    public CommissionSummaryResponse getCommissionStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal totalCommissionAmount = commissionRepository.getTotalCommissionAmountBetweenDates(startDate, endDate);
        List<Commission> commissionsInRange = commissionRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate);
        
        BigDecimal totalProcessedAmount = commissionsInRange.stream()
            .map(Commission::getOriginalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Long totalTransactionCount = (long) commissionsInRange.size();
        
        BigDecimal averageCommissionRate = commissionsInRange.isEmpty() ? 
            BigDecimal.ZERO : 
            commissionsInRange.stream()
                .map(Commission::getCommissionRate)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(commissionsInRange.size()), 2, RoundingMode.HALF_UP);
        
        List<CommissionDetailsResponse> commissionResponses = commissionsInRange.stream()
            .map(this::mapToCommissionDetailsResponse)
            .collect(Collectors.toList());
        
        return new CommissionSummaryResponse(
            totalCommissionAmount != null ? totalCommissionAmount : BigDecimal.ZERO,
            totalProcessedAmount,
            totalTransactionCount,
            averageCommissionRate,
            commissionResponses
        );
    }
    
    // Bank Details
    public void addOrUpdateBankDetails(Long userId, BankDetailsRequest request) {
        BankDetails bankDetails = bankDetailsRepository.findByUserId(userId)
            .orElse(new BankDetails());
        
        bankDetails.setUserId(userId);
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
    
    private CommissionDetailsResponse mapToCommissionDetailsResponse(Commission commission) {
        return new CommissionDetailsResponse(
            commission.getId(),
            commission.getPaymentReference(),
            commission.getPaymentId(),
            commission.getOriginalAmount(),
            commission.getCommissionRate(),
            commission.getCommissionAmount(),
            commission.getNetAmount(),
            commission.getPayerId(),
            commission.getPayeeId(),
            commission.getDescription(),
            commission.getCreatedAt(),
            commission.getCreatedBy()
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

    private PaymentType parsePaymentType(String type) {
        try {
            return PaymentType.valueOf(type.trim().toUpperCase());
        } catch (Exception e) {
            return PaymentType.OTHER; // fallback or handle as needed
        }
    }

    public Payment getPaymentByReference(String reference) {
        return paymentRepository.findByReference(reference).orElse(null);
    }
}
