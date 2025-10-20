package com.springcloud.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoredItem implements Serializable {
    private String sku;
    private String name;
    private Integer kg;
}