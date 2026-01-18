package com.sentiment.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sentiment.backend.dto.StatResponseDTO;
import com.sentiment.backend.service.StatsService;


@RestController
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/api/stats")
    public StatResponseDTO getStats(@RequestParam(defaultValue = "100") int cantidad) {
        if (cantidad < 1) cantidad = 1;
        if (cantidad > 1000) cantidad = 1000;
        return statsService.getStats(cantidad);
    }
}