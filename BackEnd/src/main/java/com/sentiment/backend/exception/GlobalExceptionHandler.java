package com.sentiment.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;

import com.sentiment.backend.dto.ErrorResponse;

import org.springframework.web.client.HttpStatusCodeException;

import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==============================
    // 400: Errores de validación (@Valid)
    // ==============================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String msg = Objects.requireNonNull(
                ex.getBindingResult().getFieldError()
        ).getDefaultMessage();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        msg,
                        "VALIDATION_ERROR"
                ));
    }

    // ==============================
    // 503: Modelo no disponible (timeout/conexión)
    // ==============================
    @ExceptionHandler({ResourceAccessException.class, ModelUnavailableException.class})
    public ResponseEntity<ErrorResponse> handleModelUnavailable(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new ErrorResponse(
                        "Modelo no disponible",
                        "MODEL_UNAVAILABLE"
                ));
    }

    // ==============================
    // 502: Error del servicio DS (FastAPI responde 4xx/5xx)
    // ==============================
    @ExceptionHandler(HttpStatusCodeException.class)
    public ResponseEntity<ErrorResponse> handleDsHttpError(HttpStatusCodeException ex) {
        /*
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(new ErrorResponse(
                        "Error del servicio de predicción (DS)",
                        "DS_SERVICE_ERROR"
                ));
         */

        // Si FastAPI responde con 4XX no es falla puede ser idioma no soportado
        if (ex.getStatusCode().is4xxClientError()) {
            String msg = extraerDetalle(ex.getResponseBodyAsString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(msg != null ? msg : "Input inválido para el modelo","VALIDATION_ERROR"));
        }
        // Si FastAPI respondió 5xx es algun fallo (proxy → 502)
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(new ErrorResponse("Error del servicio de predicción (DS)","DS_SERVICE_ERROR"));
    }

    // Extrae el detalle de la respuesta del FastAPI
    private String extraerDetalle(String body) {
        if (body == null) return null;
        var m = java.util.regex.Pattern
                .compile("\"detail\"\\s*:\\s*\"(.*?)\"")
                .matcher(body);
        return m.find() ? m.group(1) : null;
    }


    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<ErrorResponse> handleInvalidInput(InvalidInputException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(ex.getMessage(), "VALIDATION_ERROR"));
    }

    // ==============================
    // 500: Error genérico no controlado
    // ==============================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(
                        "Error interno del servidor",
                        "INTERNAL_ERROR"
                ));
    }
}
