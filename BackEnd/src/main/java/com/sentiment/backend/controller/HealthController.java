package com.sentiment.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sentiment.backend.client.SentimentDsClient;

import java.util.Map;

@RestController
public class HealthController {

    private final SentimentDsClient dsClient;

    @Value("${sentiment.mode}")
    private String mode;

    public HealthController(SentimentDsClient dsClient) {
        this.dsClient = dsClient;
    }

    @GetMapping("/health") // "/health"
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "Backend de Sentimientos funcionando"
        ));
    }

    @GetMapping("/health/model")
    public ResponseEntity<Map<String, String>> healthModel() {

        // Si estamos en mock, el “modelo” es conceptualmente UP
        if ("mock".equalsIgnoreCase(mode)) {
            return ResponseEntity.ok(Map.of(
                    "status", "OK",
                    "mode", "mock"
            ));
        }

        // Modo python: intentamos una llamada mínima al DS
        try {
            dsClient.healthCheck();
            return ResponseEntity.ok(Map.of(
                    "status", "OK",
                    "mode", "python"
            ));
        } catch (Exception ex) {
            // No dependemos de ErrorResponse acá, devolvemos algo simple
            return ResponseEntity.status(503).body(Map.of(
                    "status", "FAIL",
                    "mode", "python"
            ));
        }
    }
}
