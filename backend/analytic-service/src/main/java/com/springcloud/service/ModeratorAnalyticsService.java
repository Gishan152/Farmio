package com.springcloud.service;

import com.springcloud.dto.ModeratorDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class ModeratorAnalyticsService {
    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth.service.url}")
    private String authServiceUrl;

    /**
     * Fetch all moderators from the auth service
     */
    public List<ModeratorDTO> fetchAllModerators() {
        try {
            // Convert the regular auth URL to the moderator URL
            String moderatorUrl = authServiceUrl.replace("/user/all-dto", "/admin/moderators/all-dto");
            
            ResponseEntity<ModeratorDTO[]> response = restTemplate.getForEntity(
                    moderatorUrl, 
                    ModeratorDTO[].class
            );
            
            if (response.getBody() != null) {
                return Arrays.asList(response.getBody());
            } else {
                return Collections.emptyList();
            }
        } catch (RestClientException e) {
            // Log error in real application
            System.err.println("Error fetching moderators from auth service: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}
