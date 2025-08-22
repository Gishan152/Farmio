package com.springcloud.entity;

import com.springcloud.common.enums.PaymentStatus;
import com.springcloud.common.enums.PaymentType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // payment ID

    @Column(nullable = false)
    private Long payerId;

    @Column(nullable = false)
    private Long payeeId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(precision = 5, scale = 2)
    private BigDecimal escrowPercentage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(nullable = false)
    private String reference;

    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

//    // Constructors
//    public Payment() {
//        this.createdAt = LocalDateTime.now();
//        this.updatedAt = LocalDateTime.now();
//    }
//
//    public Payment(String paymentId, Long payerId, Long payeeId, BigDecimal amount, PaymentType type, String reference) {
//        this();
//        this.paymentId = paymentId;
//        this.payerId = payerId;
//        this.payeeId = payeeId;
//        this.amount = amount;
//        this.type = type;
//        this.reference = reference;
//        this.status = PaymentStatus.PENDING;
//    }
//
//    public void setStatus(PaymentStatus status) {
//        this.status = status;
//        this.updatedAt = LocalDateTime.now();
//    }
}
