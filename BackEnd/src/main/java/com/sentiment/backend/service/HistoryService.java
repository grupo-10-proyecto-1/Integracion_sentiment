package com.sentiment.backend.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.sentiment.backend.dto.HistoryResponseDTO;
import com.sentiment.backend.repository.SentimentStatRepository;
import com.sentiment.backend.entity.SentimentStat;

import java.util.List;

@Service
public class HistoryService {

    private final SentimentStatRepository sentimentStatRepository;

    public HistoryService(SentimentStatRepository sentimentStatRepository) {
        this.sentimentStatRepository = sentimentStatRepository;
    }

    public List<HistoryResponseDTO> getStatHistory(int limite) {
        var filas = sentimentStatRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0,limite));
        return filas.stream().map(s -> new HistoryResponseDTO(
                s.getText(),
                s.getPrevision(),
                s.getProbabilidad(),
                s.getCreatedAt()
        )).toList();
    }

}
