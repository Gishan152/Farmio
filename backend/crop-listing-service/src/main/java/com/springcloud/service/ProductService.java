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
import com.springcloud.dto.CropOrderDTO;

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
    
    /**
     * Deduct stock from a product when an order is placed
     */
    public void deductStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found with id " + productId
                ));
        
        int currentStock = product.getAvailableStock();
        if (currentStock < quantity) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient stock. Available: " + currentStock + ", Requested: " + quantity
            );
        }
        
        product.setAvailableStock(currentStock - quantity);
        productRepository.save(product);
    }

    
    /**
     * Get all products as CropOrderDTO (for order-service)
     */
    public List<CropOrderDTO> getAllProductsForOrder() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::mapToCropOrderDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Fetch products by a list of IDs
     */
    public List<CropOrderDTO> getProductsByIds(List<Long> productIds) {
        List<Product> products = productRepository.findAllById(productIds);
        return products.stream()
                .map(this::mapToCropOrderDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Fetch products by a list of IDs and return as CropOrderDTO for order-service
     */
    // public List<CropOrderDTO> getAllProductsForOrder(List<Long> productIds) {
    //     List<Product> products = productRepository.findAll(productIds);
    //     return products.stream()
    //             .map(this::mapToCropOrderDTO)
    //             .collect(Collectors.toList());
    // }
    
    /**
     * Map Product entity to CropOrderDTO (for order-service)
     * Maps fields from Product in crop-listing-service to CropInfo structure in order-service
     */
    private CropOrderDTO mapToCropOrderDTO(Product product) {
        CropOrderDTO dto = new CropOrderDTO();
        
        // Map basic fields
        dto.setId(product.getId());
        dto.setType(product.getProductName());
        dto.setPricePerUnit(java.math.BigDecimal.valueOf(product.getPricePerUnit()));
        dto.setFarm("Farm-" + product.getUserId()); // Create a farm name from userId
        dto.setAvailableStock(product.getAvailableStock());
        dto.setFarmerId(product.getUserId());
        dto.setLocation(product.getLocation());
        dto.setUnitMeasurement(product.getMeasurement());
        dto.setTransportationAvailable("Yes".equalsIgnoreCase(product.getTransportAvailability()));
        dto.setReturnsAccepted("Yes".equalsIgnoreCase(product.getReturnAccepted()));
        dto.setBadges(product.getBadges() != null ? product.getBadges() : new ArrayList<>());
        
        // Map first image URL (CropInfo uses single imageUrl, Product uses list)
        List<String> imageUrls = product.getImageUrls();
        dto.setImageUrl(imageUrls != null && !imageUrls.isEmpty() ? imageUrls.get(0) : "default.jpg");
        
        // Calculate average rating
        List<Rating> ratings = ratingRepository.findByProductId(product.getId());
        double averageRating = ratings.stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);
        dto.setRating(averageRating);
        
        // Set verified based on badge presence (if has "Certified" or "Organic" badge)
        boolean isVerified = product.getBadges() != null && 
                (product.getBadges().contains("Certified") || product.getBadges().contains("Organic"));
        dto.setVerified(isVerified);
        
        return dto;
    }
}