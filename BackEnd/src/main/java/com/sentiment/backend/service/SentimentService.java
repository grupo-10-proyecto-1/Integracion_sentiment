package com.sentiment.backend.service;

import com.sentiment.backend.dto.*;
import com.sentiment.backend.exception.InvalidInputException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sentiment.backend.client.SentimentDsClient;

import java.util.ArrayList;
import java.util.List;

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


    public BatchSentimentResponse predictBatch(List<String> texts){
        if (texts == null || texts.isEmpty()){
            throw new InvalidInputException("La lista de textos no puede estar vacía");
        }
        List<BatchItemResponse> resultados = new ArrayList<>();
        int correctos = 0;
        int fallidos = 0;
        for (int i=0;i < texts.size(); i++){
            String text = texts.get(i);
            try{
                String textLimpio = LimpiadorText.limpiarOrThrow(text);
                SentimentResponse respuesta = dsClient.predict(textLimpio);
                resultados.add(new BatchItemResponse(i,text, respuesta, null));
                correctos++;
            } catch (Exception ex){
                fallidos++;
                resultados.add(new BatchItemResponse(i,text,null, new ErrorResponse(ex.getMessage(),"BATCH_ITEM_ERROR")));
            }
        }
        return new BatchSentimentResponse(texts.size(), correctos, fallidos, resultados);
    }

}
