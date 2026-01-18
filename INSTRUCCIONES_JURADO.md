# 🏁 Guía Rápida para el Jurado (2 Minutos)

Esta guía está diseñada para levantar y probar el proyecto **Sentiment Analysis Integration** en el menor tiempo posible.

## 📋 Requisitos Previos
*   **Docker Desktop** instalado y corriendo.

## 🚀 Paso 1: Ejecución (1 minuto)

Abra una terminal en la carpeta raíz del proyecto y ejecute el siguiente comando:

```bash
docker-compose up --build
```

*Espere aproximadamente 60 segundos hasta que los logs se estabilicen.*

## 🧪 Paso 2: Prueba de Funcionalidad (1 minuto)

1.  Abra su navegador en: **[http://localhost](http://localhost)**
2.  **Caso de Prueba 1 (Positivo):**
    *   Escriba: *"El servicio es excelente y estoy muy feliz"*
    *   Haga clic en **Analizar**.
    *   *Resultado esperado:* Tarjeta **VERDE** (Positivo) con alta probabilidad.
3.  **Caso de Prueba 2 (Negativo):**
    *   Escriba: *"Estoy muy decepcionado, esto no funciona"*
    *   Haga clic en **Analizar**.
    *   *Resultado esperado:* Tarjeta **ROJA** (Negativo).

## 🔍 Enlaces Adicionales (Opcional)
*   **Documentación API (Swagger):** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
*   **Documentación Modelo IA:** [http://localhost:8000/docs](http://localhost:8000/docs)
*   **Estado del Sistema:** [http://localhost/api/health](http://localhost/api/health)

---
*Para detener la aplicación, presione `Ctrl + C` en la terminal.*