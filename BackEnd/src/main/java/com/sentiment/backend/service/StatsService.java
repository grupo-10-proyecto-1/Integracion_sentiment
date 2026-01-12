package com.sentiment.backend.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.sentiment.backend.dto.Prevision;
import com.sentiment.backend.dto.StatResponseDTO;
import com.sentiment.backend.entity.SentimentStat;
import com.sentiment.backend.repository.SentimentStatRepository;

@Service
public class StatsService {

    private final SentimentStatRepository repository;

    public StatsService(SentimentStatRepository repository) {
        this.repository = repository;
    }

    public StatResponseDTO  getStats(int cantidad) {
        var filas = repository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, cantidad));
        long total = filas.size();
        long positivos = 0;
        long neutros = 0;
        long negativos = 0;

        for (var f : filas) {
            Prevision p = f.getPrevision();
            if (p == Prevision.POSITIVO) positivos++;
            else if (p == Prevision.NEUTRO) neutros++;
            else if (p == Prevision.NEGATIVO) negativos++;
        }

        double pctPositivos = (total == 0) ? 0.0 : round2( positivos * 100.0 / total);
        double pctNeutros   = (total == 0) ? 0.0 : round2 ( neutros   * 100.0 / total);
        double pctNegativos = (total == 0) ? 0.0 : round2 ( negativos * 100.0 / total);

        return new StatResponseDTO(
                cantidad,
                total,
                positivos,
                neutros,
                negativos,
                pctPositivos,
                pctNeutros,
                pctNegativos
        );

    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
