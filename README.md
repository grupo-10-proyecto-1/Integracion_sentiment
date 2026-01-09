# 🎭 Integración Sentiment Analysis - MVP

Sistema completo de análisis de sentimientos integrado:
- **FrontEnd**: Angular + Tailwind (Puerto 4200)
- **BackEnd**: Java Spring Boot (Puerto 8080)
- **FastAPI**: Python + Scikit-learn (Puerto 8000)

---

## 🚀 Quickstart (Modo Jurado - 2 Minutos)

Para levantar todo el sistema, abre 3 terminales y ejecuta:

### Terminal 1: Cerebro (IA) 🧠
```powershell
cd FastAPI
.\.venv\Scripts\activate
uvicorn main:app --reload --port 8000
```
*Verificar: http://localhost:8000/health*

### Terminal 2: BackEnd (API) ⚙️
```powershell
cd BackEnd
.\mvnw.cmd spring-boot:run
```
*Verificar: http://localhost:8080/health*

### Terminal 3: FrontEnd (UI) 💻
```powershell
cd FrontEnd
npm start
```
*Abrir: http://localhost:4200*

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
-   **Python 3.x** (FastAPI, Scikit-learn)
-   **Angular 17** (Node.js)
-   **GitHub Actions** (CI/CD Pipeline Automatizado)
