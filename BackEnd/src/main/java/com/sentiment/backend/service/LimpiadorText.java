package com.sentiment.backend.service;

import com.sentiment.backend.exception.InvalidInputException;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

public final class LimpiadorText {

    private LimpiadorText() {}

    // URL básica
    private static final Pattern URL_PATTERN =
            Pattern.compile("(?i)\\b(https?://|www\\.)\\S+\\b");

    // Solo símbolos / emojis / signos (sin letras ni números)
    private static final Pattern ONLY_SYMBOLS_PATTERN =
            Pattern.compile("^[^\\p{L}\\p{N}]+$"); // nada de letras (L) ni números (N)

    // Risas típicas (jaja/hehe/kk/rs) repetidas
    private static final Pattern ONLY_LAUGHTER_PATTERN =
            Pattern.compile("(?i)^(\\s*(ja|ha|je|jo|ju|kk|rs)\\s*)+$");

    /**
     * Limpia sin cambiar el significado, y rechaza spam/ruido típico.
     */
    public static String limpiarOrThrow(String raw) {
        // Normalización simple
        String text = raw.trim().replaceAll("\\s+", " ");

        // Solo símbolos
        if (ONLY_SYMBOLS_PATTERN.matcher(text).matches()) {
            throw new InvalidInputException("El texto contiene solo símbolos");
        }
        // Solo risas (XD no entra acá, lo tratamos por repetición)
        if (ONLY_LAUGHTER_PATTERN.matcher(text).matches()) {
            throw new InvalidInputException("El texto contiene solo risas");
        }

        // URLs “puras” o casi puras (si saco URLs y queda nada útil)
        if (URL_PATTERN.matcher(text).find()) {
            String withoutUrls = URL_PATTERN.matcher(text).replaceAll("").trim();
            // Si quedó casi vacío o solo signos, lo rechazamos
            if (withoutUrls.length() < 3 || ONLY_SYMBOLS_PATTERN.matcher(withoutUrls).matches()) {
                throw new InvalidInputException("El texto no debe ser solo una URL");
            }
        }

        // Muy repetitivo (spam tipo "xd xd xd xd", "bueno bueno bueno bueno")
        if (muyRepetitivo(text, 0.70)) {
            throw new InvalidInputException("El texto es excesivamente repetitivo (spam)");
        }

        return text;
    }

    private static boolean muyRepetitivo(String text, double threshold) {
        String[] tokens = text.split(" ");
        if (tokens.length < 4) return false;

        Map<String, Integer> freq = new HashMap<>();
        for (String t : tokens) {
            String norm = t.toLowerCase(Locale.ROOT);
            freq.put(norm, freq.getOrDefault(norm, 0) + 1);
        }

        int max = 0;
        for (int v : freq.values()) {
            if (v > max) max = v;
        }

        double share = (double) max / (double) tokens.length;
        return share >= threshold;
    }
}
