package com.sentiment.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para la request de sentimiento.
 * Expone solo el campo `text` (el texto a analizar).
 *
 * Mensaje: el texto no puede quedar vacío ni
 * ser demasiado corto/largo. Las validaciones se hacen con Bean Validation.
 */
public record SentimentRequest(
        @JsonProperty("text")
        @NotBlank(message = "El texto no puede estar vacío")
        @Size(min = 5, max = 2000, message = "El texto debe tener entre 5 y 2000 caracteres")
        String text
                               )
{
        // Record inmutable: sólo contiene el campo text y las validaciones.
}
