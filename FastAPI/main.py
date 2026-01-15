from enum import Enum
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from langdetect import detect_langs, LangDetectException
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
# Se adiciona librerias: torch, torch.nn.functional as F and AutoTokenizer, AutoModelForSequenceClassification -> joblib borrada.

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MAX_LENGTH = 256
# DEVICE ->  Esto le dice a PyTorch donde correr el modelo: cuda → GPU NVIDIA disponible, cpu → corre en un procesador normal
# Esto garantiza que: el modelos y los temsores de entrada este en la mismo dispositivo.

#--- Carga y ruta de modelos

class RobertaPipeline:
    def __init__(self, model_dir: str):
        self.tokenizer = AutoTokenizer.from_pretrained(model_dir)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_dir)

        self.model.to(DEVICE)
        self.model.eval()

        self.id2label = self.model.config.id2label

    def predict(self, texts):
        label, _ = self._infer(texts[0])
        return [label]

    def predict_proba(self, texts):
        _, probs = self._infer(texts[0])
        return [probs]

    def _infer(self, text):
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=MAX_LENGTH,
        )

        inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = F.softmax(outputs.logits, dim=1)[0].cpu().numpy()

        pred_id = probs.argmax()
        label = self.id2label[pred_id]

        return label, probs


# Rutas 
pipeline_es = RobertaPipeline("models/model_es")
pipeline_pt = RobertaPipeline("models/model_pt")

#---


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
    
    prediction = str(prediction).upper()

    #---
    # Cambio en : confidence = float(max(probabilities)) 
    #    -> reconstrucción explícita del mapa de probabilidades (ANTES se usaba solo max(probabilities))

    labels = [pipeline.id2label[i] for i in range(len(probabilities))]
    prob_map = dict(zip(labels, probabilities))

    p_neg = float(prob_map["NEGATIVO"])
    p_neu = float(prob_map["NEUTRO"])
    p_pos = float(prob_map["POSITIVO"])

    # confianza inicial
    confidence = max(p_neg, p_neu, p_pos)

    # Neutro como refugio natural en la duda
    #    - Solapamiento → NEUTRO
    #    - NO se castiga NEUTRO

    OVERLAP_MARGIN = 0.05

    top_probs = sorted([p_neu, p_pos, p_neg], reverse=True)

    if (top_probs[0] - top_probs[1]) < OVERLAP_MARGIN:
        prediction = "NEUTRO"
        confidence = p_neu

    # Textos cortos favorecen al neutro

    UMBRAL_de_TEXTO = 120  # caracteres

    if len(text) < UMBRAL_de_TEXTO:
        # si no hay emoción fuerte, es neutral
        if max(p_pos, p_neg) < 0.60:
            prediction = "NEUTRO"
            confidence = p_neu

    
    if prediction == "POSITIVO":
        return Prevision.POSITIVO, float(confidence)
    elif prediction == "NEGATIVO":
        return Prevision.NEGATIVO, float(confidence)
    else:
        return Prevision.NEUTRO, float(confidence)
