package com.springcloud.controller;

import com.springcloud.dto.WasteAgentResponseDTO;
import com.springcloud.service.WasteAgentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WasteAgentControllerTest {

    @Mock
    private WasteAgentService wasteAgentService;

    @InjectMocks
    private WasteAgentController wasteAgentController;

    @Test
    public void testGetAllWasteAgents() {
        // Arrange
        WasteAgentResponseDTO agent1 = WasteAgentResponseDTO.builder()
                .id(1L)
                .name("John Smith")
                .email("john@example.com")
                .city("New York")
                .isActive(true)
                .isVerified(true)
                .build();

        WasteAgentResponseDTO agent2 = WasteAgentResponseDTO.builder()
                .id(2L)
                .name("Maria Garcia")
                .email("maria@example.com")
                .city("Los Angeles")
                .isActive(true)
                .isVerified(true)
                .build();

        List<WasteAgentResponseDTO> mockAgents = Arrays.asList(agent1, agent2);
        when(wasteAgentService.getAllWasteAgents()).thenReturn(mockAgents);

        // Act
        ResponseEntity<List<WasteAgentResponseDTO>> response = wasteAgentController.getAllWasteAgents(
                null, null, null, null, null, null);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        assertEquals("John Smith", response.getBody().get(0).getName());
        assertEquals("Maria Garcia", response.getBody().get(1).getName());
    }
}