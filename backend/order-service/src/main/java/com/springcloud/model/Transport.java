package com.springcloud.model;

import com.springcloud.common.enums.TransportStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "\"transport\"") // escape reserved word
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String paymentId;

    @NotNull
    @Digits(integer = 12, fraction = 2)
    @Column(nullable = false)
    private BigDecimal total;

    @NotNull
    @Column(nullable = false)
    private Long providerId;

    @NotBlank
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransportStatus status;
    // PENDING - The order has been submitted, but payment is not yet confirmed
    // PROCESSING - Payment is authorized, and order is undergoing processing (e.g., invoiced, preparing fulfillment)
    // AWAITING_PICKUP - Order is ready for fulfillment or shipping, but has not yet been dispatched
    // IN_TRANSPORT - Items are picked by the transport provider
    // DELIVERTED - Order confirmed delivered (or for digital goods, available). Considered closed
    // CANCELED - The order is canceled by the buyer or the system automatically due to long waiting in the PENDING state

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
}
