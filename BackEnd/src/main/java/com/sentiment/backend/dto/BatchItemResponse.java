package com.sentiment.backend.dto;

public record BatchSemtimentItemResponse(
        int index,
        Prevision prevision,
        Double probabilidad,
        String error
) {
}
