package com.springcloud.service;

import com.springcloud.dto.WarehouseRequestDTO;
import com.springcloud.dto.WarehouseResponseDTO;
import com.springcloud.dto.WarehouseSearchRequestDTO;
import com.springcloud.dto.LocationUpdateDTO;
import com.springcloud.dto.WarehouseCapacityDTO;
import com.springcloud.model.Warehouse;
import com.springcloud.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final CityCoordinatesService cityCoordinatesService;

    public List<WarehouseResponseDTO> getAllWarehousesByOwner(Long ownerId) {
        log.info("Fetching all warehouses for owner: {}", ownerId);
        return warehouseRepository.findByOwnerId(ownerId)
                .stream().map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public WarehouseResponseDTO getWarehouseById(Long warehouseId, Long ownerId) {
        Warehouse w = warehouseRepository.findByIdAndOwnerId(warehouseId, ownerId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));
        return convertToResponseDTO(w);
    }

    public WarehouseResponseDTO createWarehouse(WarehouseRequestDTO dto, Long ownerId) {
        log.info("Creating warehouse for owner: {}", ownerId);
        Warehouse w = convertToEntity(dto);
        w.setOwnerId(ownerId);
        w.setTotalCapacity(dto.getTotalSlots() * dto.getCapacityPerSlot()); // auto-compute
        Warehouse saved = warehouseRepository.save(w);
        log.info("Warehouse created with id: {}", saved.getId());
        return convertToResponseDTO(saved);
    }

    public WarehouseResponseDTO updateWarehouse(Long warehouseId, WarehouseRequestDTO dto, Long ownerId) {
        Warehouse w = warehouseRepository.findByIdAndOwnerId(warehouseId, ownerId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));
        updateEntityFromDTO(w, dto);
        w.setTotalCapacity(dto.getTotalSlots() * dto.getCapacityPerSlot());
        Warehouse updated = warehouseRepository.save(w);
        log.info("Updated warehouse: {}", warehouseId);
        return convertToResponseDTO(updated);
    }

    public void deleteWarehouse(Long warehouseId, Long ownerId) {
        Warehouse w = warehouseRepository.findByIdAndOwnerId(warehouseId, ownerId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));
        warehouseRepository.delete(w);
        log.info("Deleted warehouse: {}", warehouseId);
    }

    public List<WarehouseResponseDTO> searchWarehouses(String searchTerm, Long ownerId) {
        return warehouseRepository.searchWarehousesByOwner(ownerId, searchTerm)
                .stream().map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /* ---------- helpers ---------- */
    private WarehouseResponseDTO convertToResponseDTO(Warehouse w) {
        return convertToResponseDTO(w, false);
    }
    
    private WarehouseResponseDTO convertToResponseDTO(Warehouse w, boolean includeFull) {
        // Calculate capacity information
        Integer totalCapacityKg = w.getTotalCapacity() != null ? w.getTotalCapacity() : 0;
        Integer usedCapacityKg = calculateUsedCapacity(w.getId()); // TODO: Implement based on bookings
        Integer availableCapacityKg = Math.max(0, totalCapacityKg - usedCapacityKg);
        Double availablePercentage = totalCapacityKg > 0 ? 
            (availableCapacityKg.doubleValue() / totalCapacityKg.doubleValue()) * 100.0 : 0.0;
        
        // Parse certifications into badges
        List<String> badges = parseCertificationsToBadges(w.getCertifications());
        
        WarehouseResponseDTO.WarehouseResponseDTOBuilder builder = WarehouseResponseDTO.builder()
                .id(w.getId())
                .name(w.getName())
                .address(w.getAddress())
                .city(w.getCity())
                .storageType(w.getStorageType())
                .temperatureMin(w.getTemperatureMin())
                .temperatureMax(w.getTemperatureMax())
                .totalSlots(w.getTotalSlots())
                .capacityPerSlot(w.getCapacityPerSlot())
                .totalCapacity(w.getTotalCapacity())
                .totalCapacityKg(totalCapacityKg)
                .usedCapacityKg(usedCapacityKg)
                .availableCapacityKg(availableCapacityKg)
                .availableCapacityPercentage(Math.round(availablePercentage * 100.0) / 100.0)
                .pricePerKg(w.getPricePerKg())
                .pricePerTonn(w.getPricePerKg() != null ? w.getPricePerKg() * 1000 : null)
                .certifications(w.getCertifications())
                .status(w.getStatus())
                .keeperName(w.getKeeperName())
                .keeperContact(w.getKeeperContact())
                .keeperEmail(w.getKeeperEmail())
                .ownerId(w.getOwnerId())
                .latitude(w.getLatitude())
                .longitude(w.getLongitude())
                .verified(w.getStatus() == com.springcloud.model.WarehouseStatus.ACTIVE)
                .owner(w.getKeeperName() != null ? w.getKeeperName() : "Warehouse #" + w.getId())
                .rating(generateWarehouseRating(w.getId())) // TODO: Implement real rating system
                .badges(badges)
                .imageUrl(generateWarehouseImageUrl(w.getId()))
                .description(generateWarehouseDescription(w))
                .slots(calculateAvailableSlots(w))
                .capacityTons(totalCapacityKg != null ? totalCapacityKg / 1000.0 : 0.0)
                .createdAt(w.getCreatedAt())
                .updatedAt(w.getUpdatedAt());
        
        if (includeFull) {
            // Add owner information for detailed view
            builder.ownerInfo(WarehouseResponseDTO.OwnerInfo.builder()
                    .name(w.getKeeperName() != null ? w.getKeeperName() : "Warehouse Owner")
                    .avatarUrl(generateAvatarUrl(w.getOwnerId()))
                    .rating(generateOwnerRating(w.getOwnerId()))
                    .email(w.getKeeperEmail())
                    .phone(w.getKeeperContact())
                    .build());
        }
        
        return builder.build();
    }
    
    private Integer calculateUsedCapacity(Long warehouseId) {
        // TODO: Implement actual calculation based on active bookings
        // For now, return a mock value for demonstration
        return (int) (Math.random() * 1000); // Random used capacity between 0-1000kg
    }
    
    private List<String> parseCertificationsToBadges(String certifications) {
        if (certifications == null || certifications.trim().isEmpty()) {
            return List.of("Storage Facility");
        }
        
        // Parse comma-separated certifications
        return Arrays.stream(certifications.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
    
    private Double generateWarehouseRating(Long warehouseId) {
        // TODO: Implement real rating calculation from reviews
        // For now, generate a realistic random rating
        return Math.round((3.5 + Math.random() * 1.5) * 10.0) / 10.0; // Between 3.5 and 5.0
    }
    
    private String generateWarehouseImageUrl(Long warehouseId) {
        // TODO: Implement real image management
        // For now, return a placeholder or default image
        String[] images = {
            "/images/warehouse1.jpg",
            "/images/warehouse2.jpg", 
            "/images/warehouse3.jpg"
        };
        return images[(int) (warehouseId % images.length)];
    }
    
    private String generateWarehouseDescription(Warehouse w) {
        StringBuilder desc = new StringBuilder();
        desc.append(w.getName()).append(" offers ");
        
        if (w.getStorageType() != null) {
            switch (w.getStorageType()) {
                case COLD_STORAGE:
                    desc.append("cold storage facilities with temperature control");
                    break;
                case FREEZER:
                    desc.append("freezer storage for frozen products");
                    break;
                case DRY_STORAGE:
                    desc.append("dry storage for ambient temperature products");
                    break;
                default:
                    desc.append("secure storage facilities");
            }
        } else {
            desc.append("secure storage facilities");
        }
        
        desc.append(" in ").append(w.getCity()).append(". ");
        
        if (w.getTotalCapacity() != null && w.getTotalCapacity() > 0) {
            desc.append("Total capacity: ").append(w.getTotalCapacity()).append("kg. ");
        }
        
        if (w.getCertifications() != null && !w.getCertifications().trim().isEmpty()) {
            desc.append("Certified for: ").append(w.getCertifications()).append(". ");
        }
        
        desc.append("Professional storage management with 24/7 monitoring.");
        
        return desc.toString();
    }
    
    private Integer calculateAvailableSlots(Warehouse w) {
        // TODO: Implement real slot calculation
        // For now, return total slots minus some random occupied slots
        Integer totalSlots = w.getTotalSlots() != null ? w.getTotalSlots() : 10;
        Integer occupiedSlots = (int) (Math.random() * totalSlots * 0.3); // Up to 30% occupied
        return Math.max(0, totalSlots - occupiedSlots);
    }
    
    private String generateAvatarUrl(Long ownerId) {
        // TODO: Implement real avatar system
        return "https://randomuser.me/api/portraits/" + 
               (ownerId % 2 == 0 ? "men" : "women") + "/" + 
               (ownerId % 50) + ".jpg";
    }
    
    private Double generateOwnerRating(Long ownerId) {
        // TODO: Implement real owner rating system
        return Math.round((4.0 + Math.random() * 1.0) * 10.0) / 10.0; // Between 4.0 and 5.0
    }

    private Warehouse convertToEntity(WarehouseRequestDTO dto) {
        Warehouse w = new Warehouse();
        w.setName(dto.getName());
        w.setAddress(dto.getAddress());
        w.setCity(dto.getCity());
        w.setStorageType(dto.getStorageType());
        w.setTemperatureMin(dto.getTemperatureMin());
        w.setTemperatureMax(dto.getTemperatureMax());
        w.setTotalSlots(dto.getTotalSlots());
        w.setCapacityPerSlot(dto.getCapacityPerSlot());
        w.setPricePerKg(dto.getPricePerKg());
        w.setCertifications(dto.getCertifications());
        w.setStatus(dto.getStatus());
        w.setKeeperName(dto.getKeeperName());
        w.setKeeperContact(dto.getKeeperContact());
        w.setKeeperEmail(dto.getKeeperEmail());
        
        // Auto-populate coordinates if not provided but city is available
        if ((dto.getLatitude() == null || dto.getLongitude() == null) && dto.getCity() != null) {
            Double cityLat = cityCoordinatesService.getLatitudeForCity(dto.getCity());
            Double cityLng = cityCoordinatesService.getLongitudeForCity(dto.getCity());
            
            if (cityLat != null && cityLng != null) {
                w.setLatitude(dto.getLatitude() != null ? dto.getLatitude() : cityLat);
                w.setLongitude(dto.getLongitude() != null ? dto.getLongitude() : cityLng);
                log.info("Auto-populated coordinates for city '{}': [{}, {}]", dto.getCity(), cityLat, cityLng);
            } else {
                w.setLatitude(dto.getLatitude());
                w.setLongitude(dto.getLongitude());
                log.debug("No coordinates found for city '{}', using provided values", dto.getCity());
            }
        } else {
            // Use provided coordinates
            w.setLatitude(dto.getLatitude());
            w.setLongitude(dto.getLongitude());
        }
        
        return w;
        }

        private void updateEntityFromDTO(Warehouse w, WarehouseRequestDTO dto) {
            w.setName(dto.getName());
            w.setAddress(dto.getAddress());
            w.setCity(dto.getCity());
            w.setStorageType(dto.getStorageType());
            w.setTemperatureMin(dto.getTemperatureMin());
            w.setTemperatureMax(dto.getTemperatureMax());
            w.setTotalSlots(dto.getTotalSlots());
            w.setCapacityPerSlot(dto.getCapacityPerSlot());
            w.setPricePerKg(dto.getPricePerKg());
            w.setCertifications(dto.getCertifications());
            w.setStatus(dto.getStatus());
            w.setKeeperName(dto.getKeeperName());
            w.setKeeperContact(dto.getKeeperContact());
            w.setKeeperEmail(dto.getKeeperEmail());
            
            // Auto-populate coordinates if not provided but city is available
            if ((dto.getLatitude() == null || dto.getLongitude() == null) && dto.getCity() != null) {
                Double cityLat = cityCoordinatesService.getLatitudeForCity(dto.getCity());
                Double cityLng = cityCoordinatesService.getLongitudeForCity(dto.getCity());
                
                if (cityLat != null && cityLng != null) {
                    w.setLatitude(dto.getLatitude() != null ? dto.getLatitude() : cityLat);
                    w.setLongitude(dto.getLongitude() != null ? dto.getLongitude() : cityLng);
                    log.info("Auto-populated coordinates during update for city '{}': [{}, {}]", dto.getCity(), cityLat, cityLng);
                } else {
                    w.setLatitude(dto.getLatitude());
                    w.setLongitude(dto.getLongitude());
                    log.debug("No coordinates found for city '{}' during update, using provided values", dto.getCity());
                }
            } else {
                // Use provided coordinates
                w.setLatitude(dto.getLatitude());
                w.setLongitude(dto.getLongitude());
            }
        }
        
        // Location update method for existing warehouses
        public WarehouseResponseDTO updateWarehouseLocation(Long warehouseId, LocationUpdateDTO locationDTO, Long ownerId) {
            log.info("Updating location for warehouse: {} by owner: {}", warehouseId, ownerId);
            
            Warehouse warehouse = warehouseRepository.findByIdAndOwnerId(warehouseId, ownerId)
                    .orElseThrow(() -> new RuntimeException("Warehouse not found or you don't have permission to update it"));
            
            // Update location coordinates
            warehouse.setLatitude(locationDTO.getLatitude());
            warehouse.setLongitude(locationDTO.getLongitude());
            
            // Update address and city if provided
            if (locationDTO.getAddress() != null && !locationDTO.getAddress().trim().isEmpty()) {
                warehouse.setAddress(locationDTO.getAddress());
            }
            
            if (locationDTO.getCity() != null && !locationDTO.getCity().trim().isEmpty()) {
                warehouse.setCity(locationDTO.getCity());
            }
            
            Warehouse updated = warehouseRepository.save(warehouse);
            log.info("Successfully updated location for warehouse: {}", warehouseId);
            
            return convertToResponseDTO(updated);
        }
        
        // Batch location update method (for admin or data migration)
        public List<WarehouseResponseDTO> batchUpdateWarehouseLocations(List<LocationUpdateDTO> locationUpdates, Long ownerId) {
            log.info("Batch updating locations for {} warehouses by owner: {}", locationUpdates.size(), ownerId);
            
            List<WarehouseResponseDTO> updatedWarehouses = new ArrayList<>();
            
            for (LocationUpdateDTO locationDTO : locationUpdates) {
                try {
                    WarehouseResponseDTO updated = updateWarehouseLocation(locationDTO.getWarehouseId(), locationDTO, ownerId);
                    updatedWarehouses.add(updated);
                } catch (Exception e) {
                    log.error("Failed to update location for warehouse {}: {}", locationDTO.getWarehouseId(), e.getMessage());
                }
            }
            
            log.info("Successfully updated locations for {} out of {} warehouses", 
                    updatedWarehouses.size(), locationUpdates.size());
            
            return updatedWarehouses;
        }
        
        // Public methods for buyers (no owner validation)
        public List<WarehouseResponseDTO> getPublicWarehouses(String search, String city, String storageType) {
            return getPublicWarehouses(search, city, storageType, null, null, false);
        }
        
        public List<WarehouseResponseDTO> getPublicWarehouses(String search, String city, String storageType, 
                                                            Double minCapacity, Double maxPrice, Boolean verifiedOnly) {
            log.info("Fetching public warehouses with filters - search: {}, city: {}, storageType: {}, minCapacity: {}, maxPrice: {}, verifiedOnly: {}", 
                    search, city, storageType, minCapacity, maxPrice, verifiedOnly);
            
            // Get both ACTIVE and OPEN warehouses for public search
            List<Warehouse> activeWarehouses = warehouseRepository.findByStatus(com.springcloud.model.WarehouseStatus.ACTIVE);
            List<Warehouse> openWarehouses = warehouseRepository.findByStatus(com.springcloud.model.WarehouseStatus.OPEN);
            
            List<Warehouse> warehouses = new ArrayList<>();
            warehouses.addAll(activeWarehouses);
            warehouses.addAll(openWarehouses);
            
            return warehouses.stream()
                    .filter(w -> applyPublicFilters(w, search, city, storageType, minCapacity, maxPrice, verifiedOnly))
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
        }
        
        public WarehouseResponseDTO getPublicWarehouse(Long warehouseId) {
            log.info("Fetching public warehouse: {}", warehouseId);
            
            Warehouse warehouse = warehouseRepository.findById(warehouseId)
                    .orElseThrow(() -> new RuntimeException("Warehouse not found"));
            
            if (warehouse.getStatus() != com.springcloud.model.WarehouseStatus.ACTIVE) {
                throw new RuntimeException("Warehouse is not available");
            }
            
            return convertToResponseDTO(warehouse, true); // Include full details for public view
        }
        
        // Location-based search for nearby warehouses (optional coordinates)
        public List<WarehouseResponseDTO> getNearbyWarehouses(Double latitude, Double longitude, 
                                                            Integer radiusKm, String storageType, Integer limit) {
            
            // If no coordinates provided, fallback to regular filtering
            if (latitude == null || longitude == null) {
                log.info("No coordinates provided, falling back to regular warehouse search with filters");
                return getPublicWarehouses(null, null, storageType, null, null, false)
                        .stream()
                        .limit(limit != null ? limit : 20)
                        .collect(Collectors.toList());
            }
            
            log.info("Fetching warehouses within {}km of lat: {}, lng: {}", radiusKm, latitude, longitude);
            
            List<Warehouse> activeWarehouses = warehouseRepository.findByStatus(com.springcloud.model.WarehouseStatus.ACTIVE);
            
            return activeWarehouses.stream()
                    .filter(w -> storageType == null || storageType.trim().isEmpty() || 
                               w.getStorageType().toString().toLowerCase().contains(storageType.toLowerCase()))
                    // Only filter by coordinates if warehouse has them AND they're valid
                    .filter(w -> w.getLatitude() != null && w.getLongitude() != null)
                    .map(w -> {
                        WarehouseResponseDTO dto = convertToResponseDTO(w);
                        double distance = calculateDistance(latitude, longitude, w.getLatitude(), w.getLongitude());
                        dto.setDistanceKm(distance);
                        return dto;
                    })
                    .filter(dto -> radiusKm == null || dto.getDistanceKm() <= radiusKm)
                    .sorted((a, b) -> Double.compare(a.getDistanceKm(), b.getDistanceKm()))
                    .limit(limit != null ? limit : 20)
                    .collect(Collectors.toList());
        }

        // Haversine formula to calculate distance between two coordinates
        private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
            final int R = 6371; // Earth radius in kilometers
            
            double latDistance = Math.toRadians(lat2 - lat1);
            double lonDistance = Math.toRadians(lon2 - lon1);
            
            double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                    + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                    * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
                    
            double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            
            return R * c; // Distance in kilometers
        }
        
        private boolean applyPublicFilters(Warehouse warehouse, String search, String city, String storageType,
                                         Double minCapacity, Double maxPrice, Boolean verifiedOnly) {
            // Search filter (name, city, address)
            if (search != null && !search.trim().isEmpty()) {
                String searchLower = search.toLowerCase();
                if (!warehouse.getName().toLowerCase().contains(searchLower) &&
                    !warehouse.getCity().toLowerCase().contains(searchLower) &&
                    !warehouse.getAddress().toLowerCase().contains(searchLower)) {
                    return false;
                }
            }
            
            // City filter
            if (city != null && !city.trim().isEmpty() && 
                !warehouse.getCity().toLowerCase().contains(city.toLowerCase())) {
                return false;
            }
            
            // Storage type filter
            if (storageType != null && !storageType.trim().isEmpty() && 
                !warehouse.getStorageType().toString().toLowerCase().contains(storageType.toLowerCase())) {
                return false;
            }
            
            // Capacity filter
            if (minCapacity != null && warehouse.getTotalCapacity() != null) {
                Integer availableCapacity = Math.max(0, warehouse.getTotalCapacity() - calculateUsedCapacity(warehouse.getId()));
                if (availableCapacity < minCapacity) {
                    return false;
                }
            }
            
            // Price filter
            if (maxPrice != null && warehouse.getPricePerKg() != null && warehouse.getPricePerKg() > maxPrice) {
                return false;
            }
            
            // Verified filter
            if (verifiedOnly != null && verifiedOnly && warehouse.getStatus() != com.springcloud.model.WarehouseStatus.ACTIVE) {
                return false;
            }
            
            return true;
        }
        
        // Enhanced nearby search with capacity filter
        public List<WarehouseResponseDTO> getNearbyWarehouses(Double latitude, Double longitude, 
                                                            Integer radiusKm, String storageType, 
                                                            Double minCapacity, Integer limit) {
            log.info("Fetching warehouses within {}km of lat: {}, lng: {} with minCapacity: {}", 
                    radiusKm, latitude, longitude, minCapacity);
            
            // Get both ACTIVE and OPEN warehouses for public search
            List<Warehouse> activeWarehouses = warehouseRepository.findByStatus(com.springcloud.model.WarehouseStatus.ACTIVE);
            List<Warehouse> openWarehouses = warehouseRepository.findByStatus(com.springcloud.model.WarehouseStatus.OPEN);
            
            List<Warehouse> availableWarehouses = new ArrayList<>();
            availableWarehouses.addAll(activeWarehouses);
            availableWarehouses.addAll(openWarehouses);
            
            return availableWarehouses.stream()
                    .filter(w -> storageType == null || storageType.trim().isEmpty() || 
                               w.getStorageType().toString().toLowerCase().contains(storageType.toLowerCase()))
                    .filter(w -> w.getLatitude() != null && w.getLongitude() != null)
                    .filter(w -> minCapacity == null || w.getTotalCapacity() == null || 
                               (Math.max(0, w.getTotalCapacity() - calculateUsedCapacity(w.getId())) >= minCapacity))
                    .map(w -> {
                        WarehouseResponseDTO dto = convertToResponseDTO(w);
                        double distance = calculateDistance(latitude, longitude, w.getLatitude(), w.getLongitude());
                        dto.setDistanceKm(distance);
                        return dto;
                    })
                    .filter(dto -> dto.getDistanceKm() <= radiusKm)
                    .sorted((a, b) -> Double.compare(a.getDistanceKm(), b.getDistanceKm()))
                    .limit(limit)
                    .collect(Collectors.toList());
        }
        
        // Advanced search method (works with or without location data)
        public List<WarehouseResponseDTO> searchWarehousesAdvanced(WarehouseSearchRequestDTO searchRequest) {
            log.info("Advanced warehouse search: {}", searchRequest);
            
            // Get both ACTIVE and OPEN warehouses for public search
            List<Warehouse> activeWarehouses = warehouseRepository.findByStatus(com.springcloud.model.WarehouseStatus.ACTIVE);
            List<Warehouse> openWarehouses = warehouseRepository.findByStatus(com.springcloud.model.WarehouseStatus.OPEN);
            
            List<Warehouse> availableWarehouses = new ArrayList<>();
            availableWarehouses.addAll(activeWarehouses);
            availableWarehouses.addAll(openWarehouses);
            
            List<WarehouseResponseDTO> results = availableWarehouses.stream()
                    .filter(w -> applyAdvancedFilters(w, searchRequest))
                    .map(w -> {
                        WarehouseResponseDTO dto = convertToResponseDTO(w);
                        
                        // Calculate distance only if BOTH search request AND warehouse have coordinates
                        if (searchRequest.getLatitude() != null && searchRequest.getLongitude() != null &&
                            w.getLatitude() != null && w.getLongitude() != null) {
                            double distance = calculateDistance(
                                    searchRequest.getLatitude(), searchRequest.getLongitude(),
                                    w.getLatitude(), w.getLongitude());
                            dto.setDistanceKm(distance);
                        } else {
                            // Set distance to null if coordinates are not available
                            dto.setDistanceKm(null);
                        }
                        
                        return dto;
                    })
                    .filter(dto -> applyDistanceFilter(dto, searchRequest))
                    .collect(Collectors.toList());
            
            // Sort results
            sortResults(results, searchRequest.getSortBy(), searchRequest.getSortOrder());
            
            // Apply pagination
            return applyPagination(results, searchRequest.getPage(), searchRequest.getSize());
        }
        
        // Get warehouse capacity information
        public WarehouseCapacityDTO getWarehouseCapacity(Long warehouseId) {
            log.info("Fetching capacity information for warehouse: {}", warehouseId);
            
            Warehouse warehouse = warehouseRepository.findById(warehouseId)
                    .orElseThrow(() -> new RuntimeException("Warehouse not found"));
            
            Integer totalCapacity = warehouse.getTotalCapacity() != null ? warehouse.getTotalCapacity() : 0;
            Integer usedCapacity = calculateUsedCapacity(warehouse.getId());
            Integer totalSlots = warehouse.getTotalSlots() != null ? warehouse.getTotalSlots() : 0;
            Integer usedSlots = calculateUsedSlots(warehouse.getId()); // TODO: Implement based on bookings
            
            return WarehouseCapacityDTO.of(
                    warehouse.getId(),
                    warehouse.getName(),
                    totalCapacity,
                    usedCapacity,
                    totalSlots,
                    usedSlots,
                    warehouse.getPricePerKg() != null ? 
                        java.math.BigDecimal.valueOf(warehouse.getPricePerKg()) : 
                        java.math.BigDecimal.ZERO
            );
        }
        
        private Integer calculateUsedSlots(Long warehouseId) {
            // TODO: Implement actual calculation based on active bookings
            // For now, return a mock value for demonstration
            return (int) (Math.random() * 10); // Random used slots between 0-10
        }
        
        private boolean applyAdvancedFilters(Warehouse warehouse, WarehouseSearchRequestDTO searchRequest) {
            return applyPublicFilters(warehouse, searchRequest.getSearch(), searchRequest.getCity(), 
                                    searchRequest.getStorageType(), searchRequest.getMinCapacity(), 
                                    searchRequest.getMaxPrice(), searchRequest.getVerifiedOnly());
        }
        
        private boolean applyDistanceFilter(WarehouseResponseDTO dto, WarehouseSearchRequestDTO searchRequest) {
            if (searchRequest.getLatitude() != null && searchRequest.getLongitude() != null && 
                searchRequest.getRadiusKm() != null && dto.getDistanceKm() != null) {
                return dto.getDistanceKm() <= searchRequest.getRadiusKm();
            }
            return true;
        }
        
        private void sortResults(List<WarehouseResponseDTO> results, String sortBy, String sortOrder) {
            if (results == null || results.isEmpty()) {
                return;
            }
            
            Comparator<WarehouseResponseDTO> comparator;
            
            switch (sortBy != null ? sortBy.toLowerCase() : "distance") {
                case "price":
                    comparator = Comparator.comparing(WarehouseResponseDTO::getPricePerKg, 
                            Comparator.nullsLast(Comparator.naturalOrder()));
                    break;
                case "rating":
                    comparator = Comparator.comparing(WarehouseResponseDTO::getRating, 
                            Comparator.nullsLast(Comparator.naturalOrder()));
                    break;
                case "capacity":
                    comparator = Comparator.comparing(WarehouseResponseDTO::getAvailableCapacityKg, 
                            Comparator.nullsLast(Comparator.naturalOrder()));
                    break;
                case "name":
                    comparator = Comparator.comparing(WarehouseResponseDTO::getName, 
                            Comparator.nullsLast(Comparator.naturalOrder()));
                    break;
                case "distance":
                default:
                    // Handle null distances gracefully - put warehouses without distance at the end
                    comparator = Comparator.comparing(WarehouseResponseDTO::getDistanceKm, 
                            Comparator.nullsLast(Comparator.naturalOrder()));
                    break;
            }
            
            if ("desc".equalsIgnoreCase(sortOrder)) {
                comparator = comparator.reversed();
            }
            
            results.sort(comparator);
        }
        
        private List<WarehouseResponseDTO> applyPagination(List<WarehouseResponseDTO> results, 
                                                          Integer page, Integer size) {
            if (results == null || results.isEmpty()) {
                return results;
            }
            
            int pageNumber = page != null ? Math.max(0, page) : 0;
            int pageSize = size != null ? Math.max(1, Math.min(100, size)) : 20;
            
            int fromIndex = pageNumber * pageSize;
            if (fromIndex >= results.size()) {
                return List.of();
            }
            
            int toIndex = Math.min(fromIndex + pageSize, results.size());
            return results.subList(fromIndex, toIndex);
        }
    }