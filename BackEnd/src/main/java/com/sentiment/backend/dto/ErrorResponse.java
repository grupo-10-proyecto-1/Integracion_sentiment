package com.sentiment.backend.dto;


public record ErrorResponse(
        String error,
        String code
) {

}
