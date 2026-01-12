package com.sentiment.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL) // omite null en JSON
public record SentimentResponse(
        @JsonProperty("prevision") Prevision prevision,
        @JsonProperty("probabilidad") double probabilidad
) {

  
}
