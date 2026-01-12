package com.sentiment.backend.service;

import org.springframework.stereotype.Service;

import com.sentiment.backend.dto.Prevision;
import com.sentiment.backend.entity.SentimentStat;
import com.sentiment.backend.repository.SentimentStatRepository;


@Service
public class SentimentStatService {

    private final SentimentStatRepository sentimentStatRepository;

    public SentimentStatService(SentimentStatRepository sentimentStatRepository) {
        this.sentimentStatRepository = sentimentStatRepository;
    }

    public SentimentStat guardar(String text, Prevision prevision, Double probabilidad) {
        SentimentStat sentimentStat = new SentimentStat(text,prevision, probabilidad);
        return sentimentStatRepository.save(sentimentStat);
    }

}
