package com.sentiment.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sentiment.backend.client.SentimentDsClient;
import com.sentiment.backend.dto.Prevision;
import com.sentiment.backend.dto.SentimentResponse;

/**
 * Servicio principal de negocio para el análisis de sentimientos.
 * Actúa como orquestador entre el controlador REST y el cliente del modelo de
 * Data Science.
 * Maneja la lógica de "modo mock" vs "modo python" y la persistencia de
 * estadísticas.
 */
@Service
public class SentimentService {

    private final SentimentDsClient dsClient;
    private final SentimentStatService sentimentStatService;

    @Value("${sentiment.mode}")
    private String mode;

    public SentimentService(SentimentDsClient dsClient, SentimentStatService sentimentStatService) {
        this.dsClient = dsClient;
        this.sentimentStatService = sentimentStatService;
    }

    /**
     * Orquesta el modo de ejecución:
     * - mock: devuelve una respuesta fija para pruebas/demos
     * - python: delega la predicción al cliente de DS (FastAPI)
     * - persiste la consulta solo si es del modelo para no ensuciar la DB.
     */
    public SentimentResponse predict(String text) {

        // Limpiando la cadena para URL, simbolos o textos repetitivos
        String textLimpio = LimpiadorText.limpiarOrThrow(text);

        if ("mock".equalsIgnoreCase(mode)) {
            return new SentimentResponse(Prevision.POSITIVO, 0.95);
        }
        SentimentResponse respuesta = dsClient.predict(textLimpio);
        // Persistencia agregada por Dev 1
        sentimentStatService.guardar(textLimpio, respuesta.prevision(), respuesta.probabilidad());
        return respuesta;
    }

    /**
     * Verifica la conexión con el modelo si no estamos en modo mock.
     */
    public void checkHealth() {
        if (!"mock".equalsIgnoreCase(mode)) {
            dsClient.healthCheck();
        }
    }
}
