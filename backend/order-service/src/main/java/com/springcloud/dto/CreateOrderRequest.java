package com.springcloud.dto;
import java.util.List;

public record CreateOrderRequest (
    List<OrderItemRequest> items
){ }