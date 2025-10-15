package com.springcloud.dto;

import java.util.Map;

public record ModeratorUpdateRequest(
    String name,
    String nic,
    String email,
    String phone,
    String address,
    String role,
    String department,
    Map<String, Map<String, Boolean>> permissions
) {}
