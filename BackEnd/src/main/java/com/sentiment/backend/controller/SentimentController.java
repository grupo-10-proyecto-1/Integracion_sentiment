package com.sentiment.backend.controller;

import com.sentiment.backend.dto.SentimentResponse;
import com.sentiment.backend.service.SentimentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sentiment")
public class SentimentController {

    private final SentimentService sentimentService;

    public SentimentController(SentimentService sentimentService) {
        this.sentimentService = sentimentService;
    }

    @PostMapping
    public ResponseEntity<SentimentResponse> predict(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        return ResponseEntity.ok(sentimentService.predict(text));
    }
}