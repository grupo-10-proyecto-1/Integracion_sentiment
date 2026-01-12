# 🎭 Sentiment Analysis API - Demo

API REST para análisis de sentimientos, diseñada para integrarse con modelos de IA (FastAPI) o funcionar en modo Mock para demostraciones rápidas.

## 🚀 Quickstart (30 segundos)

### Prerrequisitos
- Java 17
- Maven (opcional si usas el Wrapper `mvnw` o Docker)
- Docker (opcional)

### Ejecución Local
1. Clonar el repositorio.
2. Ejecutar:
   ```bash
   ./mvnw spring-boot:run
   ```
3. Probar:
   ```bash
   curl -X POST http://localhost:8080/sentiment -H "Content-Type: application/json" -d '{"text": "Me encanta este proyecto"}'
   ```

### Ejecución con Docker
```bash
docker-compose up --build
```

---

## ⚙️ Configuración

El comportamiento se controla vía `application.properties` o variables de entorno:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `SENTIMENT_MODE` | `mock` | (Por defecto) Devuelve respuestas simuladas aleatorias. Ideal para demos UI. |
| `SENTIMENT_MODE` | `python` | Intenta conectar con el servicio de IA real. |
| `PYTHON_API_URL` | URL | URL del servicio FastAPI (ej. `http://localhost:8000`). |

---

## 🛠️ Endpoints Principales

### 1. Analizar Sentimiento
- **POST** `/sentiment`
- **Body**: `{ "text": "Texto a analizar" }`
- **Response**: `{ "sentiment": "POSITIVO", "score": 0.95 }`

### 2. Health Check
- **GET** `/actuator/health` o `/health` (si está configurado)
- Verifica que el servicio esté arriba.

---

## 🐛 Troubleshooting

**Error: "Connection refused" en modo Python**
- Asegúrate de que el servicio de IA esté corriendo en el puerto 8000.
- Si usas Docker, descomenta el servicio `sentiment-model` en `docker-compose.yml`.

**Error: Java version**
- Este proyecto requiere **Java 17**. Verifica con `java -version`.

---

## 🧪 Casos de Prueba (QA)

| Caso | Input | Código Esperado |
|------|-------|-----------------|
| **Éxito** | `{"text": "Hola mundo"}` | **200 OK** |
| **Error Validación** | `{"text": ""}` | **400 Bad Request** |
| **Modelo Caído** | (Simular apagando Python) | **503 Service Unavailable** |

---

*Proyecto creado para Hackathon NoCountry.*
## corregido
---

*Proyecto creado para Hackathon NoCountry.*
