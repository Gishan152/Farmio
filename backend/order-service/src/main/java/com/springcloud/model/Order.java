// Order.java
package com.springcloud.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.springcloud.common.enums.OrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"orders\"") // escape reserved word
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @NotBlank
    @Column(nullable = false)
    private String paymentId;

    @NotNull
    @Digits(integer = 12, fraction = 2)
    @Column(nullable = false)
    private BigDecimal total;

    @NotNull
    @Column(nullable = false)
    private Long farmerId;

    @NotNull
    @Column(nullable = false)
    private Long buyerId;

    @NotBlank
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    // PENDING - The order has been submitted, but payment is not yet confirmed
    // PROCESSING - Payment is authorized, and order is undergoing processing (e.g., invoiced, preparing fulfillment)
    // AWAITING_PICKUP - Order is ready for fulfillment or shipping, but has not yet been dispatched
    // IN_TRANSPORT - Items are picked by the transport provider
    // DELIVERTED - Order confirmed delivered (or for digital goods, available). Considered closed
    // CANCELED - The order is canceled by the buyer or the system automatically due to long waiting in the PENDING state

    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}
