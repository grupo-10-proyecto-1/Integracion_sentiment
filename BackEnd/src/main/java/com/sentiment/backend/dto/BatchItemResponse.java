package com.sentiment.backend.dto;

public record BatchItemResponse(
        int index,
        String text,
        SentimentResponse result,
        ErrorResponse error
) {
}
