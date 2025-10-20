package com.springcloud.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private Long userId;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal escrowedAmount = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private String status = "ACTIVE";
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public Wallet() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Wallet(Long userId) {
        this();
        this.userId = userId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { 
        this.balance = balance; 
        this.updatedAt = LocalDateTime.now();
    }
    
    public BigDecimal getEscrowedAmount() { return escrowedAmount; }
    public void setEscrowedAmount(BigDecimal escrowedAmount) { 
        this.escrowedAmount = escrowedAmount; 
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { 
        this.status = status; 
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public void addToBalance(BigDecimal amount) {
        this.balance = this.balance.add(amount);
        this.updatedAt = LocalDateTime.now();
    }
    
    public void subtractFromBalance(BigDecimal amount) {
        this.balance = this.balance.subtract(amount);
        this.updatedAt = LocalDateTime.now();
    }
    
    public void addToEscrow(BigDecimal amount) {
        this.escrowedAmount = this.escrowedAmount.add(amount);
        this.updatedAt = LocalDateTime.now();
    }
    
    public void subtractFromEscrow(BigDecimal amount) {
        this.escrowedAmount = this.escrowedAmount.subtract(amount);
        this.updatedAt = LocalDateTime.now();
    }
}
