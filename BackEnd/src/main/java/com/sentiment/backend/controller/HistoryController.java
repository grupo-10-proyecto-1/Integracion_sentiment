package com.sentiment.backend.controller;

import com.sentiment.backend.dto.HistoryResponseDTO;
import com.sentiment.backend.service.HistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<List<HistoryResponseDTO>> getHistory(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(historyService.getStatHistory(limit));
    }
}