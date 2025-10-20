package com.springcloud.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleGeocodeResponse {
    private List<GeocodeResult> results;
    private String status;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeocodeResult {
        private List<AddressComponent> address_components;
        private String formatted_address;
        private Geometry geometry;
        private String place_id;
        private List<String> types;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressComponent {
        private String long_name;
        private String short_name;
        private List<String> types;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Geometry {
        private Location location;
        private String location_type;
        private Viewport viewport;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Location {
        private Double lat;
        private Double lng;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Viewport {
        private Location northeast;
        private Location southwest;
    }
}
