package com.springcloud.service;

import com.springcloud.model.Product;
import com.springcloud.model.Rating;
import com.springcloud.repository.ProductRepository;
import com.springcloud.dto.AddProductDTO;
import com.springcloud.dto.EditProductDTO;
import com.springcloud.dto.ProductResponseDTO;
import com.springcloud.repository.RatingRepository; // Import Rating 
import com.springcloud.model.Rating; // Import Rating model
import com.springcloud.dto.ProductResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired 
    private RatingRepository ratingRepository;
    
   public List<ProductResponseDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::mapToProductResponseDTO)
                .collect(Collectors.toList());
    }

    // MODIFIED: Return the new DTO
    public List<ProductResponseDTO> getProductsByUserId(Long userId) {
        List<Product> products = productRepository.findByUserId(userId);
        return products.stream()
                .map(this::mapToProductResponseDTO)
                .collect(Collectors.toList());
    }

    public void addOrUpdateRating(Long productId, Long userId, int ratingValue) {
        // Ensure product exists
        productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        // Check if a rating already exists for this user and product
        Optional<Rating> existingRatingOpt = ratingRepository.findByProductIdAndUserId(productId, userId);

        Rating rating;
        if (existingRatingOpt.isPresent()) {
            // Update existing rating
            rating = existingRatingOpt.get();
        } else {
            // Create a new rating
            rating = new Rating();
            rating.setProductId(productId);
            rating.setUserId(userId);
        }
        rating.setRating(ratingValue);
        ratingRepository.save(rating);
    }

    private ProductResponseDTO mapToProductResponseDTO(Product product) {
        // 1. Create the DTO from the product
        ProductResponseDTO dto = new ProductResponseDTO(product);
        
        // 2. Fetch all ratings for this product from the database
        List<Rating> ratings = ratingRepository.findByProductId(product.getId());
        
        // 3. Calculate the average using a Java Stream
        double average = ratings.stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0); // If there are no ratings, default to 0.0
                
        // 4. Set the calculated values on the DTO
        dto.setAverageRating(average);
        dto.setRatingCount(ratings.size());
        
        return dto;
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
                    String url =  filename;
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
                    String url =  filename;
                    updatedImageUrls.add(url);
                }
            }
        }
       
        product.setImageUrls(updatedImageUrls);

        return productRepository.save(product);
    }
}