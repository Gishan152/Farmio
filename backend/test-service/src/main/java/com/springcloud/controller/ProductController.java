package com.springcloud.controller;

import com.springcloud.client.ProductServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProductController {

    @Value("${server.port}")
    private String port;

    private final ProductServiceClient productServiceClient;

    public ProductController(ProductServiceClient productServiceClient) {
        this.productServiceClient = productServiceClient;
    }

    @GetMapping("/test/{id}")
    public String getProduct(@PathVariable String id) {
        return productServiceClient.getProductById(id).getId();
    }
}
