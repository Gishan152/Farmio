package com.springcloud.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "requester")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Requester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Role role;   // FARMER or WAREHOUSE_OWNER

    private Double rating;

    private String location;

    @Column(name = "created_at", updatable = false, insertable = false)
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private java.time.LocalDateTime updatedAt;

    private String accountNumber;

    public enum Role {
        FARMER, WAREHOUSE_OWNER
    }
}
