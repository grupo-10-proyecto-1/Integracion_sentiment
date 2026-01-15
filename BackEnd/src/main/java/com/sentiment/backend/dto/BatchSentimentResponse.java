package com.sentiment.backend.dto;

import java.util.List;

public record BatchSentimentResponse(
        int total,
        int correctos,
        int fallidos,
        List<BatchItemResponse> resultados
) {}
