package com.springcloud.dto;

import com.springcloud.common.enums.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;

public record RegisterRequest (
//        @NotBlank(message = "Username is required")
//        @Size(min = 3, max = 50, message = "Username must be 3–50 chars")
        String username,

//        @NotBlank(message = "NIC is required")
        String nic,

//        @NotBlank(message = "Email is required")
//        @Email(message = "Must be a valid email")
        String email,

//        @NotBlank(message = "Phone number is required")
//        @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
        String phoneNo,

//        @NotBlank(message = "Password is required")
//        @Pattern(
//                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–{}:;',?/*~$^+=<>]).{8,20}$",
//                message = "Password must be 8–20 chars, include upper/lower/digit/special"
//        )
        String password,

//        @NotNull(message = "Role is required")
//        @Enumerated(EnumType.STRING)
        Role role
) {

}
