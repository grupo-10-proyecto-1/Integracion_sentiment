from enum import Enum
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
from langdetect import detect_langs, LangDetectException

pipeline_es = joblib.load("models/sentiment_pipeline_es.joblib")
pipeline_pt = joblib.load("models/sentiment_pipeline_pt.joblib")


class TextInput(BaseModel):
    text: str = Field(..., min_length=1, description="Texto a analizar")


class Prevision(str, Enum):
    POSITIVO = "POSITIVO"
    NEGATIVO = "NEGATIVO"
    NEUTRO = "NEUTRO"


class PredictResponse(BaseModel):
    prevision: Prevision
    probabilidad: float = Field(..., ge=0.0, le=1.0)


app = FastAPI(
    title="Sentiment DS API",
    version="1.0.0",
    description="Microservicio DS para análisis de sentimiento (ES/PT)."
)


@app.get("/")
def root():
    """
    Endpoint raíz para verificar que la API está en línea.
    """
    return {"message": "API funcionando"}


@app.get("/health")
def health():
    """
    Endpoint de salud utilizado por el BackEnd para verificar disponibilidad.
    Retorna 200 OK si el servicio está activo.
    """
    return {"status": "OK"}


@app.post("/predict", response_model=PredictResponse)
def predict(data: TextInput):
    """
    Endpoint principal de predicción.
    Recibe un texto, detecta el idioma (ES/PT) y retorna el sentimiento y la probabilidad.
    """
    prevision, score = analyze_sentiment(data.text)
    return {"prevision": prevision, "probabilidad": score}


def analyze_sentiment(text: str):
    # Detectar idioma
    try:
        langs = detect_langs(text)
    except LangDetectException:
        raise HTTPException(status_code=400, detail="No se pudo detectar el idioma del texto")

    top = langs[0]
    language = top.lang
    confidence_lang = top.prob

    # Umbral: si lo dejás alto, muchos textos cortos fallan.
    # Podés bajarlo a 0.60 o hacer fallback a ES.
    if confidence_lang < 0.70:
        raise HTTPException(status_code=400, detail="No se pudo determinar el idioma con suficiente confianza")

    if language == "es":
        pipeline = pipeline_es
    elif language == "pt":
        pipeline = pipeline_pt
    else:
        raise HTTPException(status_code=400, detail="Idioma no soportado (solo es/pt)")

    prediction = pipeline.predict([text])[0]
    probabilities = pipeline.predict_proba([text])[0]
    confidence = float(max(probabilities))

    prediction = str(prediction).upper()

    if prediction == "POSITIVO":
        return Prevision.POSITIVO, confidence
    if prediction == "NEGATIVO":
        return Prevision.NEGATIVO, confidence
    else:
        return Prevision.NEUTRO, confidence
