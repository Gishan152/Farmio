package com.springcloud.dto;

import java.util.Map;
import java.util.Set;

public record ModeratorCreateRequest(
    String name,
    String nic,
    String email,
    String phone,
    String address,
    String role,
    String department,
    String temporaryPassword,
    Map<String, Map<String, Boolean>> permissions
) {}
