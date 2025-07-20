package com.springcloud.dto;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

@Getter
public class ValidationErrorResponse {

    private final String status = "BAD_REQUEST";
    private final List<String> errors = new ArrayList<>();


    public ValidationErrorResponse addError(String error) {
        this.errors.add(error);
        return this;
    }

    // getters and optionally setters
}
