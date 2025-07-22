package com.farmio.wasteservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "waste_agents")
public class WasteAgent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "agent_id")
    private Long agentId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "company_name")
    private String companyName;
}
