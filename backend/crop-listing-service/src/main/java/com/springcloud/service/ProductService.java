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

    public List<Product> getProductsByUserId(Long userId) {
        return productRepository.findByUserId(userId);
    }

    public Product addProduct(AddProductDTO dto, Long userId) {
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
        // Check if the images array is not null to prevent errors
        if (dto.getImages() != null) {
            for (MultipartFile file : dto.getImages()) {
                if (!file.isEmpty()) {
                    // 1. Store the file using the new service method
                    String filename = fileStorageService.storeFile(file);
                    // 2. Construct the correct URL path
                    String url = "/uploads/" + filename;
                    imageUrls.add(url);
                }
            }
        }
        product.setImageUrls(imageUrls);

        return productRepository.save(product);
    }

    public Product editProduct(Long id, EditProductDTO dto, Long userId) {
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

        // Handle images: start with the list of existing images to keep
        List<String> updatedImageUrls = new ArrayList<>();
        if (dto.getExistingImages() != null) {
            updatedImageUrls.addAll(dto.getExistingImages());
        }

        // Add the newly uploaded images
        if (dto.getNewImages() != null) {
            for (MultipartFile file : dto.getNewImages()) {
                if (!file.isEmpty()) {
                    // 1. Store the new file
                    String filename = fileStorageService.storeFile(file);
                    // 2. Construct its URL and add it to the list
                    String url = "/uploads/" + filename;
                    updatedImageUrls.add(url);
                }
            }
        }
       
        product.setImageUrls(updatedImageUrls);

        return productRepository.save(product);
    }
}