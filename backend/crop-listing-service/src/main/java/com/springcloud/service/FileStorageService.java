package com.springcloud.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    public String uploadFile(MultipartFile file) {
        // Placeholder for actual file upload logic (e.g., to AWS S3 or local storage)
        return "https://example.com/uploads/" + file.getOriginalFilename();
    }
}