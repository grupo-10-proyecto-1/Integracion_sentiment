package com.sentiment.backend.dto;

public record StatResponseDTO(
        int limit,
        long total,
        long positivos,
        long neutros,
        long negativos,
        double pctPositivos,
        double pctNeutros,
        double pctNegativos
) {
}
