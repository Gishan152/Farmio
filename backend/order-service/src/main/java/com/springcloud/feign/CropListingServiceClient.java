package com.springcloud.feign;

import com.springcloud.model.CropInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "crop-listing-service")
public interface CropListingServiceClient {
    
    @GetMapping("/api/products/all-for-order")
    List<CropInfo> getAllProducts();
    
    @PostMapping("/api/products/by-ids")
    List<CropInfo> getProductsByIds(@RequestBody List<Long> productIds);
    
    @GetMapping("/api/products/{id}")
    CropInfo getProductById(@PathVariable("id") Long id);
    
    @PutMapping("/api/products/{id}/deduct-stock")
    void deductStock(@PathVariable("id") Long id, @RequestParam("quantity") Integer quantity);
}
