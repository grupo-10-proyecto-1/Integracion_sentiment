# 🎭 Integración Sentiment Analysis - MVP

> **👨‍⚖️ Para el Jurado:** Ver Guía Rápida de Evaluación (2 min)

Sistema completo de análisis de sentimientos integrado:
- **FrontEnd**: Angular + Tailwind (Puerto 4200)
- **BackEnd**: Java Spring Boot (Puerto 8080)
- **FastAPI**: Python + PyTorch/Transformers (Puerto 8000)

---

## 🚀 Quickstart (Modo Producción - Docker)

Para levantar todo el sistema unificado (Backend, Frontend, IA) con un solo comando:

1.  Asegúrate de tener **Docker Desktop** corriendo.
2.  Ejecuta en la raíz del proyecto:

```powershell
docker-compose up --build # en windows
sudo docker-compose up --build # en linux
```

3.  Acceder a la aplicación:
    *   **Web UI**: [http://localhost](http://localhost)
    *   **API Docs (FastAPI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
    *   **API Backend**: [http://localhost/api/health](http://localhost/api/health)

---

## 💻 Desarrollo Local (Modo Manual)

Si prefieres ejecutar cada servicio por separado para desarrollo:

### Terminal 1: Cerebro (IA) 🧠
```powershell
cd FastAPI
.\.venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Terminal 2: BackEnd (API) ⚙️
```powershell
cd BackEnd
.\mvnw.cmd spring-boot:run
```

### Terminal 3: FrontEnd (UI) 💻
```powershell
cd FrontEnd
npm start
```
*Nota: En modo manual, asegúrate de que el Frontend apunte a `localhost:8080` y no a `/api`.*

---

## 🧪 Guía de Demo

1.  **Análisis Positivo**:
    -   Escribir: *"El servicio es excelente y estoy muy feliz"*
    -   Resultado: **POSITIVO** (Verde)

2.  **Análisis Negativo**:
    -   Escribir: *"Estoy muy decepcionado, esto no funciona"*
    -   Resultado: **NEGATIVO** (Rojo)

3.  **Validación**:
    -   Intentar enviar texto vacío.
    -   Resultado: Botón deshabilitado (Protección UI).

---

## 🛠️ Tecnologías
-   **Java 17** (Spring Boot 3.2.4)
-   **Python 3.x** (FastAPI, PyTorch, Transformers)
-   **Angular 17** (Node.js)
-   **GitHub Actions** (CI/CD Pipeline Automatizado)
