package com.springcloud.dto;

// If you're calling an external API (like a user service), you need to define a matching data transfer object (DTO)

public class ProductDto {
    private String productId;
    private String port;

    // Getters and setters
    public String getId() { return productId; }
    public String getPort() { return port; }
    public void setId(String productId) { this.productId = productId; }
    public void setPort(String port) { this.port = port; }
}