package com.sentiment.backend.dto;

import java.time.LocalDateTime;

public record HistoryResponseDTO(
        String text,
        Prevision prevision,
        Double probabilidad,
        LocalDateTime createdAt
) {
}
