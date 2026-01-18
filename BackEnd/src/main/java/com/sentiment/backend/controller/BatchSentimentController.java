package com.sentiment.backend.controller;

import com.sentiment.backend.dto.BatchSentimentRequest;
import com.sentiment.backend.dto.BatchSentimentResponse;
import com.sentiment.backend.service.SentimentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sentiment")
public class BatchSentimentController {

    private final SentimentService service;

    public BatchSentimentController(SentimentService service) {
        this.service = service;
    }

    @PostMapping("/batch")
    public ResponseEntity<BatchSentimentResponse> predictBatch(@RequestBody BatchSentimentRequest request){
        BatchSentimentResponse respuesta =  service.predictBatch(request.texts());
        return ResponseEntity.ok(respuesta);
    }
}
