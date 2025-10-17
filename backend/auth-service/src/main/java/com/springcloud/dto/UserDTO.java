package com.springcloud.dto;

import java.util.Set;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String status;
    private String phoneNo;
    private String nic;
    private Set<String> roles;

    public UserDTO() {}

    // Constructor from User entity
    public UserDTO(Long id, String username, String email, String status, String phoneNo, String nic) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.status = status;
        this.phoneNo = phoneNo;
        this.nic = nic;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }

    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}
