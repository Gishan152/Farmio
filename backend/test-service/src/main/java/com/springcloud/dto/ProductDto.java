package com.springcloud.dto;

public class ProductDto {
    private String productId;
    private String port;

    public String getId() {
        return productId;
    }

    public void setId(String productId) {
        this.productId = productId;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }
}
