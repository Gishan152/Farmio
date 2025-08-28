package com.springcloud.model;

public enum StorageType {
    COLD_STORAGE("Cold Storage (0°C to 14°C)"),
    DRY_STORAGE("Dry Storage");
    
    private final String displayName;
    
    StorageType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
