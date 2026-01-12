# ✅ Tareas definitivas BE (4 desarrolladores)

---

## 👤 Dev 1 — Líder de API e Integración (Conector Java ↔ FastAPI)

**Rol:** Core Developer (puente a Python)

### 🎯 Objetivo
Implementar el `SentimentService` que llama al modelo de Data Science vía **RestTemplate**, y conectar el servicio con el Controller.  
Debe funcionar con **modo mock** si Python aún no está listo.

### 🛠️ Tareas
- Crear `service/SentimentService.java`
  - Método: `SentimentResponse predict(String text)`
  - Si `sentiment.mode=python` → llama a `python.api.url` (`http://localhost:8000/predict`)
  - Si falla conexión/timeout → lanza excepción controlada o devuelve error **“Modelo no disponible”**
  - Si `sentiment.mode=mock` → devuelve respuesta ficticia (para seguir probando sin DS)
- Crear `config/RestTemplateConfig.java`
  - `@Bean RestTemplate` reutilizable (❌ no crear `new RestTemplate()` por request)
- Usar properties:
  - `python.api.url=...`
  - `sentiment.mode=mock|python`

### 📦 Entregables
- `SentimentService` + `RestTemplateConfig`
- Controller usando el service (inyección por **constructor**, evitar `@Autowired` si es posible)

### ✅ Criterios de aceptación (DoD)
- Con `sentiment.mode=mock` la API responde aunque Python no exista
- Con `sentiment.mode=python` y FastAPI arriba, responde lo que diga DS
- Con Python apagado, **no se cae** y devuelve error controlado (400/503 según acuerden)

**Branch:** `feat/python-integration-service`

---

## 👤 Dev 2 — Calidad, Validaciones y Excepciones (Frontera / Seguridad)

**Rol:** Data Validator + Error Handling

### 🎯 Objetivo
Hacer que la API sea robusta: validar input, manejar errores elegantes y evitar que “explote” si DS falla.

### 🛠️ Tareas
- Validación de entrada en `/sentiment`
  - Si `text` no existe → `400`
  - Si `text` vacío → `400`
  - Si `text.length < 3` (o 5 si deciden) → `400`  
    > ⚠️ Fijen YA el mínimo. El agente sugirió **3**; recomendación: **5**. Elegir uno y documentarlo.
- Crear `GlobalExceptionHandler` (`@RestControllerAdvice`)
  - Capturar error de conexión con Python (ej. `ResourceAccessException`) o una excepción propia (ej. `ModelUnavailableException`)
  - Responder JSON elegante:  
    ```json
    { "error": "Modelo no disponible" }
    ```
    *(sin meter errores dentro de `prevision`)*
- Definir código HTTP para modelo caído
  - Recomendado: **503 Service Unavailable**

### 📦 Entregables
- Validación consolidada
- `GlobalExceptionHandler` funcionando

### ✅ Criterios de aceptación (DoD)
- Request inválido → `400` con JSON `{ "error": "..." }`
- Python apagado → `503` con JSON `{ "error": "Modelo no disponible" }`
- Request válido → `200` con `prevision` y `probabilidad`

**Branch:** `feat/validation-global-handler`

---

## 👤 Dev 3 — DTO & Model Manager (Contratos JSON)

**Rol:** Arquitecto de Datos

### 🎯 Objetivo
Dejar el **contrato JSON** impecable y estable (Java ↔ Python).  
Sin esto, el equipo se rompe a mitad del hackathon.

### 🛠️ Tareas
- Crear / ajustar DTOs definitivos:
  - `SentimentRequest` con `text`
  - `SentimentResponse` con:
    - `prevision` *(string)*
    - `probabilidad` *(double 0–1)*
  - `ErrorResponse` *(recomendado)* con `error`
- Asegurar compatibilidad con Jackson:
  - Constructor vacío + getters/setters
  - Nombres exactos:
    - `text`
    - `prevision`
    - `probabilidad`
- Alineación con DS (contrato)
  - Confirmar con DS: **probabilidad será double 0–1** (ej. `0.88`), no `"88%"`
  - Documentar en README (o comentario) el formato exacto

### 📦 Entregables
- `SentimentRequest.java`
- `SentimentResponse.java` limpio
- `ErrorResponse.java` (o `error` en response, pero mejor clase aparte)

### ✅ Criterios de aceptación (DoD)
- Si FastAPI devuelve  
  ```json
  { "prevision": "Positivo", "probabilidad": 0.88 }
se mapea perfecto en Java

El JSON de salida de Java coincide 1:1 con el contrato acordado

Branch: feat/dtos-contract

se mapea perfecto en Java

El JSON de salida de Java coincide 1:1 con el contrato acordado

Branch: feat/dtos-contract

👤 Dev 4 — DevOps, Testing & Documentación (Cierre / Demo)

Rol: QA & Infrastructure

🎯 Objetivo

Asegurar que el proyecto se pueda correr, probar y demostrar rápido.

🛠️ Tareas

Crear pruebas manuales:

Postman collection o

archivo .http para VS Code o

script curl.sh

Casos mínimos:

Positivo

Negativo

Vacío

Texto corto

(Opcional) texto largo

Documentación README:

Cómo correr Spring

Cómo correr FastAPI

Configuración (sentiment.mode, python.api.url)

(Opcional recomendado) Endpoint GET /health

Responde { "status": "ok" }

📦 Entregables

README completo y simple

Colección / script de pruebas

(Opcional) endpoint /health

✅ Criterios de aceptación (DoD)

Un jurado clona y prueba en 2 minutos

Está documentado cómo probar con mock y cómo probar con Python

Branch: docs/testing-readme-health

📌 Reglas finales

Acuerdo YA con DS: probabilidad será double (0–1)

Orden de merge recomendado:

Dev 3 — DTOs contrato

Dev 1 — Service integración

Dev 2 — Validaciones + Handler

Dev 4 — Docs + Pruebas + Health