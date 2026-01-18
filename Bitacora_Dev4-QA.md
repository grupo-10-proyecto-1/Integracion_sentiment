# Bitácora de QA - Dev4

Este documento registra los hallazgos, errores y soluciones aplicadas durante el proceso de QA y pruebas de integración.

---

## **Fecha: 16 de enero de 2026**

### Incidencia 1: El servicio del modelo (FastAPI) no se inicia

*   **Servicio Afectado:** `sentiment-model`
*   **Fase de Prueba:** 1.1 (Levantamiento del Entorno)

#### Síntoma
Al ejecutar `docker-compose up --build`, el contenedor `sentiment-model` se detiene (`exited with code 1`). Los logs muestran los errores `huggingface_hub.errors.RepositoryNotFoundError` y `OSError: models/model_es is not a local folder...`.

#### Causa Raíz
La aplicación FastAPI intentaba descargar los modelos de lenguaje desde el Hub de Hugging Face en lugar de cargarlos desde la carpeta local `/app/models`. El código en `FastAPI/main.py` pasaba una ruta (`"models/model_es"`) que la librería `transformers` interpretaba como un ID de repositorio remoto.

#### Solución Aplicada (Intento 1)
Se modificó `FastAPI/main.py` para añadir el prefijo `./` a las rutas (`"./models/model_es"`), intentando forzar una ruta relativa.

*   **Resultado (Intento 1):** **FALLIDO.** El error cambió a `HFValidationError`, indicando que la ruta relativa se interpretó como un nombre de repositorio con formato incorrecto.

---

## **Fecha: 16 de enero de 2026 - Actualización**

### Incidencia 1.2: Causa raíz y solución definitiva del fallo de inicio

*   **Servicio Afectado:** `sentiment-model`
*   **Fase de Prueba:** 1.1 (Levantamiento del Entorno)

#### Causa Raíz (Análisis final)
La librería `transformers` requiere una ruta inequívoca para cargar un modelo local. Las rutas relativas (`./...`) resultaron ambiguas. La solución correcta es utilizar la ruta absoluta dentro del sistema de archivos del contenedor.

#### Solución Aplicada (Intento 2 - Definitivo)
Se modificó `FastAPI/main.py` para usar la ruta absoluta del modelo, que es `/app/models/...` según la configuración del `Dockerfile`.

**Código Antiguo (del intento 1):**
```python
pipeline_es = RobertaPipeline("./models/model_es")
pipeline_pt = RobertaPipeline("./models/model_pt")
```

**Código Nuevo:**
```python
pipeline_es = RobertaPipeline("/app/models/model_es")
pipeline_pt = RobertaPipeline("/app/models/model_pt")
```

*   **Resultado:** **RESUELTO.** La combinación de tener los archivos del modelo en la ubicación correcta (`FastAPI/models/...`) y usar una ruta absoluta en el código (`/app/models/...`) permitió que el servicio se iniciara correctamente.

---

## **Fecha: 16 de enero de 2026 - Fase 1: Entorno y Smoke Tests**

### Paso 1.1 y 1.2: Levantamiento y Verificación de Contenedores

*   **Acción:** Se ejecutó `docker-compose up --build` y `docker ps`.
*   **Resultado:** **ÉXITO.** Tras resolver la incidencia del modelo, todos los servicios se iniciaron correctamente. La salida de `docker ps` confirma que los contenedores `sentiment-backend`, `sentiment-frontend`, `sentiment-model` y `nginx-proxy` están en estado `Up`.

**Evidencia (`docker ps`):**
```
CONTAINER ID   IMAGE                                      COMMAND                  CREATED          STATUS          PORTS                                         NAMES
a4d8a8e01959   integracion_sentiment-sentiment-backend    "java -jar app.jar"      10 minutes ago   Up 10 minutes   8080/tcp                                      sentiment-backend
f9507488b189   integracion_sentiment-sentiment-frontend   "/docker-entrypoint.…"   10 minutes ago   Up 10 minutes   80/tcp                                        sentiment-frontend
a3f2c8a6724d   integracion_sentiment-sentiment-model      "uvicorn main:app --…"   10 minutes ago   Up 10 minutes   0.0.0.0:8000->8000/tcp, [::]:8000->8000/tcp   sentiment-model
ef1294ffcefc   nginx:alpine                               "/docker-entrypoint.…"   4 days ago       Up 10 minutes   0.0.0.0:80->80/tcp, [::]:80->80/tcp           nginx-proxy
```

### Paso 1.3: Pruebas de Humo (Smoke Tests)

*   **Acción:** Se accedió a los endpoints principales de cada servicio a través del navegador.
*   **Resultado:** **ÉXITO.** Confirmado por el usuario. Todos los servicios responden correctamente en sus puertos expuestos.
    *   `http://localhost:4200` (Frontend): **OK**
    *   `http://localhost:8080/swagger-ui/index.html` (Backend Docs): **OK**
    *   `http://localhost:8000/docs` (Modelo Docs): **OK**

---

## **Fecha: 16 de enero de 2026 - Fase 2: Pruebas de Integración (API)**

### INT-01: Backend ↔ Modelo (Happy Path)
*   **Acción:** POST `/api/sentiment` con texto de prueba.
*   **Resultado:** *En espera de ejecución.*

### INT-02: Backend ↔ Base de Datos (Persistencia)
*   **Acción:** GET `/api/history` para verificar el guardado.
*   **Resultado:** **FALLO.** El servidor respondió con `500 Internal Server Error` (`{"error":"Error interno del servidor","code":"INTERNAL_ERROR"}`).
    *   **Diagnóstico:** Los logs indican que la aplicación inicia correctamente, pero al usar una base de datos H2 basada en archivo (`./data/sentimentdb`) dentro del contenedor, las tablas no se están creando automáticamente por defecto.
    *   **Solución (Intento 1):** Se agregó `SPRING_JPA_HIBERNATE_DDL_AUTO=update`. **Resultado:** Falló nuevamente (posible problema de permisos de escritura en disco dentro del contenedor).
    *   **Solución (Intento 2):** Se cambió la base de datos a modo memoria (`jdbc:h2:mem:sentimentdb`) en `docker-compose.yml`. **Resultado:** Persiste el error 500 al consultar el historial (`GET`) después de crear un registro (`POST`). Se requiere revisión profunda de logs para identificar error de código (posible fallo de serialización JSON).
    *   **Acción de Debug:** Se habilitaron las variables `SERVER_ERROR_INCLUDE_STACKTRACE=always` en `docker-compose.yml` para visualizar la excepción directamente en la respuesta JSON de Postman, ya que los logs del contenedor no mostraban el stack trace completo.
    *   **Hallazgo Crítico:** La respuesta JSON `{ "error": "Error interno del servidor", "code": "INTERNAL_ERROR" }` confirma que existe un `GlobalExceptionHandler` (`@ControllerAdvice`) que captura la excepción y oculta el stack trace, ignorando la configuración de Spring Boot. Se requiere inspección del código fuente (`Sentiment.java` y el manejador de excepciones) para encontrar la causa raíz (probablemente serialización).
    *   **Solución (Intento 3):** Se agregó `SPRING_JACKSON_SERIALIZATION_FAIL_ON_EMPTY_BEANS=false` en `docker-compose.yml`. Esto suele corregir el error `InvalidDefinitionException` causado por proxies de Hibernate (Lazy Loading) al serializar entidades JPA a JSON.
    *   **Hallazgo Definitivo (Logs):** El log mostró `NoResourceFoundException: No static resource api/history`. Esto indica que el endpoint `/api/history` **no existía** en el código. El error 500 era un falso positivo generado por el `GlobalExceptionHandler`.
    *   **Solución Final:** Se creó la clase `HistoryController.java` mapeada a `/api/history` y se actualizó `GlobalExceptionHandler.java` para manejar correctamente los errores 404.

### INT-03: Manejo de Errores (Resiliencia)
*   **Acción:** Detener `sentiment-model` y enviar petición al Backend.
*   **Resultado:** *En espera de ejecución.*
    *   **Nota:** Se detectó un problema de permisos al intentar reiniciar el contenedor (`docker start`). Se requiere `sudo` o configuración de grupo docker.

## **Fecha: 16 de enero de 2026 - Actualización de Codebase**

### Confirmación de la Solución (FastAPI/main.py)

*   **Acción:** Se verificó el archivo `FastAPI/main.py`.
*   **Resultado:** **CONFIRMADO.** Las rutas de los modelos en `FastAPI/main.py` están configuradas correctamente con rutas absolutas (`/app/models/model_es` y `/app/models/model_pt`). Esto asegura que el servicio `sentiment-model` pueda cargar sus modelos correctamente.