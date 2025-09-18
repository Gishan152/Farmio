package com.springcloud.model;

public enum FacilityStatus {
    OPERATIONAL("Operational"),
    MAINTENANCE("Under Maintenance"),
    CLOSED("Closed"),
    FULL("At Full Capacity"),
    PARTIAL("Partially Available");
    
    private final String displayName;
    
    FacilityStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
} 