007-FastAPI-python-model

Microservicio FastAPI (Python) para exponer un modelo de análisis de sentimientos vía HTTP.
Este proyecto forma parte del Hackathon NoCountry - Proyecto 1: SentimentAPI.

🎯 Objetivo

Recibir un texto y devolver:

prevision: POSITIVO | NEGATIVO | NEUTRO (en MAYÚSCULAS)

probabilidad: número 0–1

Este repositorio hoy usa una lógica mock/simple (reglas) para permitir integración con el Backend Java. El modelo real puede reemplazar esa lógica más adelante sin romper el contrato.

✅ Contrato (DS ↔ BE)
POST /predict

Request

{ "text": "El servicio fue excelente" }


Response

{ "prevision": "POSITIVO", "probabilidad": 0.9 }

GET /health

Response

{ "status": "OK" }

GET /

Response

{ "message": "API funcionando" }

🚀 Ejecutar en local (recomendado para desarrollo)
Requisitos

Python 3.11+ (recomendado 3.11 / 3.12)

pip

Nota: No es obligatorio usar Conda. Si tu equipo ya usa Conda, también funciona.

1) Crear entorno virtual

Windows (PowerShell)

py -m venv .venv
.\.venv\Scripts\Activate.ps1


Linux/Mac

python3 -m venv .venv
source .venv/bin/activate

2) Instalar dependencias
pip install -r requirements.txt

3) Levantar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000

4) Probar

Swagger: http://localhost:8000/docs

Health: http://localhost:8000/health

🐳 Ejecutar con Docker (cross-platform)
Build
docker build -t sentiment-ds .

Run
docker run --rm -p 8000:8000 sentiment-ds


Luego probá:

http://localhost:8000/docs

http://localhost:8000/health

🔌 Integración con Backend Java

El Backend Java debe llamar a:

Base URL: http://localhost:8000

Predict path: /predict

Health path: /health

Ejemplo:

POST http://localhost:8000/predict con body {"text":"..."}

🧠 Nota sobre el “modelo”

Actualmente analyze_sentiment() simula el comportamiento del modelo con reglas básicas (palabras positivas/negativas).
Más adelante, esta función se puede reemplazar por:

modelo serializado (joblib/pickle) cargado al iniciar

pipeline TF-IDF + Logistic Regression, etc.

Lo importante: mantener el contrato estable para no romper el Backend.

🧪 Ejemplos de prueba rápidos

Positivo

{ "text": "El servicio fue excelente" }


Negativo

{ "text": "El producto es horrible" }


Neutro

{ "text": "El producto llegó ayer" }

📌 Estructura del proyecto

main.py → API FastAPI + endpoints (/predict, /health) + lógica mock del modelo

requirements.txt → dependencias mínimas

Dockerfile → imagen Docker para correrlo en cualquier entorno

.dockerignore → evita copiar archivos innecesarios al build