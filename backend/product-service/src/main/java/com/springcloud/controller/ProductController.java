package com.springcloud.controller;

import com.springcloud.dto.ProductDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

    @Value("${server.port}")
    private String port;

    @GetMapping("/products/{id}")
    public ProductDto getProduct(@PathVariable String id) {
//        return "Product ID: " + id + " from port " + port;
        ProductDto dt = new ProductDto();
        dt.setId(id);
        dt.setPort(this.port);
        return dt;
    }
}
