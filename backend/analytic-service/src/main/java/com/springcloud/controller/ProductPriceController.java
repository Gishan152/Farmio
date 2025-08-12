package com.springcloud.controller;

import com.springcloud.dto.ProductPriceDTO;
import com.springcloud.dto.ProductPriceRequest;
import com.springcloud.service.ProductPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class ProductPriceController {

    @Autowired
    private ProductPriceService productPriceService;

    @GetMapping("/moderator/prices")
    public ResponseEntity<List<ProductPriceDTO>> getAllProductPrices() {
        List<ProductPriceDTO> prices = productPriceService.getAllProductPrices();
        return ResponseEntity.ok(prices);
    }

    @GetMapping("/prices")
    public ResponseEntity<List<ProductPriceDTO>> getActiveProductPrices() {
        List<ProductPriceDTO> prices = productPriceService.getActiveProductPrices();
        return ResponseEntity.ok(prices);
    }

    @GetMapping("/prices/category/{category}")
    public ResponseEntity<List<ProductPriceDTO>> getProductPricesByCategory(@PathVariable String category) {
        List<ProductPriceDTO> prices = productPriceService.getProductPricesByCategory(category);
        return ResponseEntity.ok(prices);
    }

    @GetMapping("/moderator/prices/{id}")
    public ResponseEntity<ProductPriceDTO> getProductPriceById(@PathVariable Long id) {
        return productPriceService.getProductPriceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/moderator/prices")
    public ResponseEntity<ProductPriceDTO> createProductPrice(@RequestBody ProductPriceRequest request) {
        ProductPriceDTO createdPrice = productPriceService.createProductPrice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPrice);
    }

    @PutMapping("/moderator/prices/{id}")
    public ResponseEntity<ProductPriceDTO> updateProductPrice(@PathVariable Long id, @RequestBody ProductPriceRequest request) {
        return productPriceService.updateProductPrice(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/moderator/prices/{id}")
    public ResponseEntity<Void> deleteProductPrice(@PathVariable Long id) {
        boolean deleted = productPriceService.deleteProductPrice(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/moderator/prices/{id}/deactivate")
    public ResponseEntity<ProductPriceDTO> deactivateProductPrice(@PathVariable Long id) {
        return productPriceService.deactivateProductPrice(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/moderator/prices/{id}/activate")
    public ResponseEntity<ProductPriceDTO> activateProductPrice(@PathVariable Long id) {
        return productPriceService.activateProductPrice(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
