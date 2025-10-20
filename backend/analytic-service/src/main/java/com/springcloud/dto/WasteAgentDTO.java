package com.springcloud.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WasteAgentDTO {
    private Long agentId;
    private String name;
    private String contactNumber;
    private String email;
    private String address;
    private String companyName;
}