package com.springcloud.dto;

import java.util.Map;
import java.util.Set;

public class ModeratorDTO {
    private Long id;
    private String name;
    private String username;
    private String nic;
    private String email;
    private String phone;
    private String address;
    private String role;
    private String department;
    private Map<String, Map<String, Boolean>> permissions;
    private String status;
    private String activityLevel;
    private String joinDate;
    private String lastActive;

    // Constructors
    public ModeratorDTO() {}
    
    public ModeratorDTO(Long id, String name, String username, String nic, String email, 
                        String phone, String address, String role, String department, 
                        String status) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.nic = nic;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.role = role;
        this.department = department;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Map<String, Map<String, Boolean>> getPermissions() {
        return permissions;
    }

    public void setPermissions(Map<String, Map<String, Boolean>> permissions) {
        this.permissions = permissions;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(String activityLevel) {
        this.activityLevel = activityLevel;
    }

    public String getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(String joinDate) {
        this.joinDate = joinDate;
    }

    public String getLastActive() {
        return lastActive;
    }

    public void setLastActive(String lastActive) {
        this.lastActive = lastActive;
    }
}
