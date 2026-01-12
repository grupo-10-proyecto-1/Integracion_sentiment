package com.sentiment.backend.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import com.sentiment.backend.dto.Prevision;
import com.sentiment.backend.dto.SentimentResponse;
import com.sentiment.backend.exception.ModelUnavailableException;

import java.util.Map;

@Component
public class SentimentDsClient {

    private static final Logger logger = LoggerFactory.getLogger(SentimentDsClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String predictPath;
    private final String healthPath;

    public SentimentDsClient(RestTemplate restTemplate,
                             @Value("${python.api.base-url}") String baseUrl,
                             @Value("${python.api.predict-path}") String predictPath,
                             @Value("${python.api.health-path}") String healthPath) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.predictPath = predictPath;
        this.healthPath = healthPath;
    }

    private String url(String path){
        String b = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length()-1): baseUrl;
        String p = path.startsWith("/") ? path : "/" + path;
        return b + p;
    }

    /**
     * Cliente HTTP hacia el servicio de Data Science (FastAPI).
     * Envía { "text": ... } a /predict y espera { "prevision": "...", "probabilidad": ... }.
     * Incluye 1 reintento ante timeout/conexión. Si falla, lanza ModelUnavailableException (manejada por el handler global).
     */
    public SentimentResponse predict(String text) {
        // retry mínimo: 1 reintento extra solo si hay timeout/conexión
        try {
            return doCall(text);
        } catch (ResourceAccessException ex) {
            // intento 2
            try {
                return doCall(text);
            } catch (ResourceAccessException ex2) {
                // lo normalizamos para que el handler lo traduzca a 503
                throw new ModelUnavailableException("Modelo no disponible", ex2);
            }
        }
    }

    private SentimentResponse doCall(String text) {
        String predictUrl = url(predictPath);
        Map<String, Object> response =
                restTemplate.postForObject(
                        predictUrl,
                        Map.of("text", text),
                        Map.class
                );

        if (response == null) {
            throw new ModelUnavailableException("Respuesta vacía desde DS");
        }

        Object previsionRaw = response.get("prevision");
        Object probRaw = response.get("probabilidad");

        if (previsionRaw == null || probRaw == null) {
            throw new ModelUnavailableException("Respuesta incompleta desde DS");
        }

        Prevision prevision;
        try {
            prevision = Prevision.valueOf(previsionRaw.toString().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ModelUnavailableException("Valor inválido de prevision desde DS: " + previsionRaw, e);
        }

        double probabilidad;
        try {
            probabilidad = ((Number) probRaw).doubleValue();
        } catch (ClassCastException e) {
            throw new ModelUnavailableException("Valor inválido de probabilidad desde DS: " + probRaw, e);
        }

        return new SentimentResponse(prevision, probabilidad);
    }

    /**
     * Verifica disponibilidad del servicio DS llamando al endpoint de health configurado.
     * Si falla la conexión o el servicio no responde, RestTemplate lanza excepción.
     */
    public void healthCheck(){
        String healthUrl = url(healthPath);
        restTemplate.getForObject(healthUrl,String.class);
    }
}
