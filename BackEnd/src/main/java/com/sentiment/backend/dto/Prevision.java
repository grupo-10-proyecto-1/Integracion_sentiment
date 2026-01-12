package com.sentiment.backend.dto;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Prevision {

    POSITIVO("Positivo"),
    NEUTRO("Neutro"),
    NEGATIVO("Negativo");

    private final String value;

    Prevision(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
