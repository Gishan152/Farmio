package com.springcloud.model;

public enum WarehouseStatus {
    ACTIVE("active"),
    OPEN("open"),
    CLOSED("closed"), 
    MAINTENANCE("maintenance");
    
    private final String value;
    
    WarehouseStatus(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
}
