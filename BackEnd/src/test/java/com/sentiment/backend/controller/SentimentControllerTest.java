package com.sentiment.backend.controller;

import com.sentiment.backend.client.SentimentDsClient;
import com.sentiment.backend.dto.Prevision;
import com.sentiment.backend.dto.SentimentResponse;
import com.sentiment.backend.dto.StatResponseDTO;
import com.sentiment.backend.service.SentimentService;
import com.sentiment.backend.service.StatsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Incluimos HealthController y StatsController para probarlos también
@WebMvcTest(controllers = {SentimentController.class, HealthController.class, StatsController.class})
class SentimentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SentimentService sentimentService;

    @MockBean
    private SentimentDsClient sentimentDsClient;

    @MockBean
    private StatsService statsService;

    @Test
    void whenValidInput_thenReturn200() throws Exception {
        // Mockeamos que el servicio devuelva POSITIVO
        when(sentimentService.predict(anyString()))
                .thenReturn(new SentimentResponse(Prevision.POSITIVO, 0.99));

        mockMvc.perform(post("/api/sentiment")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\": \"Me gusta este proyecto\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.prevision").value("Positivo"));
    }

    @Test
    void whenEmptyInput_thenReturn400() throws Exception {
        mockMvc.perform(post("/api/sentiment")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\": \"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void whenGetStats_thenReturns200() throws Exception {
        when(statsService.getStats(anyInt()))
                .thenReturn(new StatResponseDTO(100, 0L, 0L, 0L, 0L, 0.0, 0.0, 0.0));

        mockMvc.perform(get("/api/stats"))
                .andExpect(status().isOk());
    }

    @Test
    void whenGetHealth_thenReturns200() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void whenGetModelHealth_thenReturns200() throws Exception {
        mockMvc.perform(get("/api/health/model"))
                .andExpect(status().isOk());
    }
}