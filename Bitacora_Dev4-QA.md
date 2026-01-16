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
*   **Resultado:** PENDIENTE de confirmación del usuario.
    *   `http://localhost:4200` (Frontend): PENDIENTE
    *   `http://localhost:8080/swagger-ui/index.html` (Backend Docs): PENDIENTE
    *   `http://localhost:8000/docs` (Modelo Docs): PENDIENTE