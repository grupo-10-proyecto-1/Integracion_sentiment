package com.sentiment.backend.dto;

import java.util.List;

public record BatchSentimentRequest(List<String> texts){
}
