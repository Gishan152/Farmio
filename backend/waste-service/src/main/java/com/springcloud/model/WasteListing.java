package com.springcloud.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "waste_listing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WasteListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String wasteType;
    private String description;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private Requester requester;   // updated to use Requester

    @Column(nullable = false)
    private BigDecimal quantity;

    @Enumerated(EnumType.STRING)
    private Unit unit;   // KG, TON, LITER

    private String timeSlot;

    @Column(name = "price_per_unit", nullable = false)
    private BigDecimal pricePerUnit;

    @Column(name = "total_price", insertable = false, updatable = false)
    private BigDecimal totalPrice;

    private LocalDate availableFrom;
    private LocalDate expiresOn;

    private String status;

    @Column(name = "created_at", updatable = false, insertable = false)
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private java.time.LocalDateTime updatedAt;

    @Column(name = "accepted_by")
    private Long acceptedBy;

    public enum Unit {
        KG, TON, LITER
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
