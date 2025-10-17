package com.springcloud.service;

import com.springcloud.dto.ProductPriceDTO;
import com.springcloud.dto.ProductPriceRequest;
import com.springcloud.model.ProductPrice;
import com.springcloud.repository.ProductPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductPriceService {

    @Autowired
    private ProductPriceRepository productPriceRepository;

    /**
     * Get all product prices
     */
    public List<ProductPriceDTO> getAllProductPrices() {
        return productPriceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get active product prices
     */
    public List<ProductPriceDTO> getActiveProductPrices() {
        return productPriceRepository.findByActive(true).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get product prices by category
     */
    public List<ProductPriceDTO> getProductPricesByCategory(String category) {
        return productPriceRepository.findByCategory(category).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get product price by ID
     */
    public Optional<ProductPriceDTO> getProductPriceById(Long id) {
        return productPriceRepository.findById(id)
                .map(this::mapToDTO);
    }

    /**
     * Create new product price
     */
    @Transactional
    public ProductPriceDTO createProductPrice(ProductPriceRequest request) {
        ProductPrice productPrice = new ProductPrice();
        updateEntityFromRequest(productPrice, request);
        productPrice = productPriceRepository.save(productPrice);
        return mapToDTO(productPrice);
    }

    /**
     * Update product price
     */
    @Transactional
    public Optional<ProductPriceDTO> updateProductPrice(Long id, ProductPriceRequest request) {
        Optional<ProductPrice> optionalProductPrice = productPriceRepository.findById(id);
        if (optionalProductPrice.isPresent()) {
            ProductPrice productPrice = optionalProductPrice.get();
            updateEntityFromRequest(productPrice, request);
            productPrice = productPriceRepository.save(productPrice);
            return Optional.of(mapToDTO(productPrice));
        }
        return Optional.empty();
    }

    /**
     * Delete product price
     */
    @Transactional
    public boolean deleteProductPrice(Long id) {
        if (productPriceRepository.existsById(id)) {
            productPriceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Deactivate product price
     */
    @Transactional
    public Optional<ProductPriceDTO> deactivateProductPrice(Long id) {
        Optional<ProductPrice> optionalProductPrice = productPriceRepository.findById(id);
        if (optionalProductPrice.isPresent()) {
            ProductPrice productPrice = optionalProductPrice.get();
            productPrice.setActive(false);
            productPrice = productPriceRepository.save(productPrice);
            return Optional.of(mapToDTO(productPrice));
        }
        return Optional.empty();
    }

    /**
     * Activate product price
     */
    @Transactional
    public Optional<ProductPriceDTO> activateProductPrice(Long id) {
        Optional<ProductPrice> optionalProductPrice = productPriceRepository.findById(id);
        if (optionalProductPrice.isPresent()) {
            ProductPrice productPrice = optionalProductPrice.get();
            productPrice.setActive(true);
            productPrice = productPriceRepository.save(productPrice);
            return Optional.of(mapToDTO(productPrice));
        }
        return Optional.empty();
    }

    /**
     * Update entity from request
     */
    private void updateEntityFromRequest(ProductPrice productPrice, ProductPriceRequest request) {
        productPrice.setProductName(request.getProductName());
        productPrice.setCategory(request.getCategory());
        productPrice.setMinPrice(request.getMinPrice());
        productPrice.setMaxPrice(request.getMaxPrice());
        productPrice.setRecommendedPrice(request.getRecommendedPrice());
        productPrice.setUnit(request.getUnit());
        productPrice.setDescription(request.getDescription());
        if (request.getActive() != null) {
            productPrice.setActive(request.getActive());
        }
    }

    /**
     * Map entity to DTO
     */
    private ProductPriceDTO mapToDTO(ProductPrice productPrice) {
        ProductPriceDTO dto = new ProductPriceDTO();
        dto.setId(productPrice.getId());
        dto.setProductName(productPrice.getProductName());
        dto.setCategory(productPrice.getCategory());
        dto.setMinPrice(productPrice.getMinPrice());
        dto.setMaxPrice(productPrice.getMaxPrice());
        dto.setRecommendedPrice(productPrice.getRecommendedPrice());
        dto.setUnit(productPrice.getUnit());
        dto.setDescription(productPrice.getDescription());
        dto.setActive(productPrice.getActive());
        dto.setCreatedAt(productPrice.getCreatedAt());
        dto.setUpdatedAt(productPrice.getUpdatedAt());
        return dto;
    }
}
