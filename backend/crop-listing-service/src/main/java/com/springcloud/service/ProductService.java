package com.springcloud.service;

import com.springcloud.model.Product;
import com.springcloud.repository.ProductRepository;
import com.springcloud.dto.AddProductDTO;
import com.springcloud.dto.EditProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FileStorageService fileStorageService;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(AddProductDTO dto,Long userId) {
        Product product = new Product();
        product.setUserId(userId);
        product.setProductName(dto.getProductName());
        product.setMeasurement(dto.getMeasurement());
        product.setPricePerUnit(dto.getPricePerUnit());
        product.setAvailableStock(dto.getAvailableStock());
        product.setLocation(dto.getLocation());
        product.setTransportAvailability(dto.getTransportAvailability());
        product.setReturnAccepted(dto.getReturnAccepted());
        product.setBadges(dto.getBadges());

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : dto.getImages()) {
            String url = fileStorageService.uploadFile(file);
            imageUrls.add(url);
        }
        product.setImageUrls(imageUrls);

        return productRepository.save(product);
    }

    public Product editProduct(Long id, EditProductDTO dto,Long userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found with id " + id
                ));
        product.setUserId(userId);
        product.setProductName(dto.getProductName());
        product.setMeasurement(dto.getMeasurement());
        product.setPricePerUnit(dto.getPrice());
        product.setAvailableStock(dto.getStock());
        product.setLocation(dto.getAddress());
        product.setTransportAvailability(dto.getTransport());
        product.setReturnAccepted(dto.getReturnAccepted());
        product.setBadges(dto.getBadges());

        // Handle images
        List<String> currentImages = product.getImageUrls();
        List<String> existingImages = dto.getExistingImages();
        List<String> imagesToKeep = currentImages.stream()
                .filter(existingImages::contains)
                .collect(Collectors.toList());

        List<String> newImageUrls = new ArrayList<>();
        for (MultipartFile file : dto.getNewImages()) {
            String url = fileStorageService.uploadFile(file);
            newImageUrls.add(url);
        }

        List<String> updatedImageUrls = new ArrayList<>(imagesToKeep);
        updatedImageUrls.addAll(newImageUrls);
        product.setImageUrls(updatedImageUrls);

        return productRepository.save(product);
    }
}
