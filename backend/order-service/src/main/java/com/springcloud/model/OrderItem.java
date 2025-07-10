// OrderItem.java
package com.springcloud.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_item")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @NotNull
    @Column(nullable = false)
    private Long cropId;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false)
    private BigDecimal pricePerUnit;

    @NotBlank
    @Column(nullable = false)
    private String unitMeasurement;

    @NotNull
    @Digits(integer = 12, fraction = 2)
    @Column(nullable = false)
    private BigDecimal quantity;
}
