package com.springcloud.controller;

import com.springcloud.model.Product;
import com.springcloud.service.ProductService;
import com.springcloud.dto.AddProductDTO;
import com.springcloud.dto.EditProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

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
}