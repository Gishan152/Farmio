package com.springcloud.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class CropInfo {
    private Long id;
    private String type;
    private BigDecimal pricePerUnit;
    private String farm;
    private Long farmerId;               // newly added
    private String location;
    private double rating;
    private boolean verified;
    private String imageUrl;
    private String unitMeasurement;
    private boolean transportationAvailable;
    private boolean returnsAccepted;
    private List<String> badges;
}
