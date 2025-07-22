package com.springcloud.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import com.springcloud.common.enums.BidStatus;

@Entity
@Table(name = "farmer_bid")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerBid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_request_id", nullable = false)
    private BuyerRequest buyerRequest;

    @Column(nullable = false)
    private Long farmerId;

    private double biddingPrice;
    private String location;
    private LocalDate deadline;
    private String notes;
    private LocalDate createdDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BidStatus bidStatus = BidStatus.PENDING;
}
