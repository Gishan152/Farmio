package com.springcloud.controller;

import com.springcloud.model.Product;
import com.springcloud.service.ProductService;
import com.springcloud.dto.AddProductDTO;
import com.springcloud.dto.EditProductDTO;
import com.springcloud.dto.ProductResponseDTO;
import com.springcloud.dto.RatingDTO;
import com.springcloud.dto.CropOrderDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    
    @GetMapping("/admin/all")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<ProductResponseDTO>> getAllProductss() {
        List<ProductResponseDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/my-products")
    public ResponseEntity<List<ProductResponseDTO>> getMyProducts(@RequestHeader("X-User-Id") Long userId) {
        List<ProductResponseDTO> products = productService.getProductsByUserId(userId);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/createproduct")
    public ResponseEntity<?> addProduct(
            @ModelAttribute AddProductDTO dto,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-Roles") String rolesCsv
    ) {
        try {
            Product product = productService.addProduct(dto, userId);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/editproduct/{id}")
    public ResponseEntity<?> editProduct(
            @PathVariable Long id,
            @ModelAttribute EditProductDTO dto,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-Roles") String rolesCsv
    ) {
        try {
            Product product = productService.editProduct(id, dto, userId);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // NEW ENDPOINT: To add or update a rating
    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateProduct(
            @PathVariable Long id,
            @RequestBody RatingDTO ratingDTO,
            @RequestHeader("X-User-Id") Long userId
    ) {
        try {
            productService.addOrUpdateRating(id, userId, ratingDTO.getRating());
            return ResponseEntity.ok().body("Rating submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // NEW ENDPOINT: To deduct stock when an order is placed
    @PutMapping("/{id}/deduct-stock")
    public ResponseEntity<?> deductStock(
            @PathVariable Long id,
            @RequestParam("quantity") Integer quantity
    ) {
        try {
            productService.deductStock(id, quantity);
            return ResponseEntity.ok().body("Stock deducted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // NEW ENDPOINT: To fetch products by a list of IDs (returns CropOrderDTO for order-service)
    @PostMapping("/by-ids")
    public ResponseEntity<List<CropOrderDTO>> getProductsByIds(@RequestBody List<Long> productIds) {
        List<CropOrderDTO> products = productService.getProductsByIds(productIds);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/suggest")
    public ResponseEntity<List<com.springcloud.dto.CropOrderDTO>> getAllProductsForOrder() {
        List<com.springcloud.dto.CropOrderDTO> products = productService.getAllProductsForOrder();
        return ResponseEntity.ok(products);
    }
}