# Integración Sentiment — Entregable Final (Grupo 10)

Solución completa de **clasificación de texto para Análisis de Sentimiento** en **Español (ES)** y **Portugués (PT)**, comparando enfoques clásicos de Machine Learning y modelos avanzados basados en **Transformers**.

Este proyecto cubre el ciclo completo:
- **ETL** (extracción, limpieza, normalización, etiquetado y muestreo estratificado)
- **Entrenamiento y evaluación** de modelos
- **Exportación de métricas y matrices de confusión**
- **Persistencia de modelos** para despliegue / inferencia

---

## Objetivo del proyecto

Construir y comparar modelos capaces de identificar patrones semánticos y lingüísticos en comentarios, evaluando:

- Desempeño (Accuracy, F1 Macro, F1 Weighted)
- Robustez (especialmente en clase **NEUTRO**)
- Viabilidad de despliegue (peso del modelo, latencia, costo computacional)

---

## Modelos implementados

Se implementaron **cinco enfoques principales**, cubriendo modelos clásicos y Transformers:

### Modelos clásicos (Machine Learning)
1. **Árbol de Decisión (Decision Tree)**  
2. **Naive Bayes (MultinomialNB + TF-IDF)**  
3. **TF-IDF + Regresión Logística** (ES y PT)

### Modelos Transformers (Deep Learning)
4. **BETO (ES)** — `dccuchile/bert-base-spanish-wwm-cased`  
5. **RoBERTa (PT)** — `xlm-roberta-base`

---

## Proceso ETL (resumen)

El proyecto implementa ETL para ambos idiomas con el objetivo de entregar datasets consistentes y comparables.

### ETL Español (ES)
Dataset: reseñas de Amazon en español (Hugging Face).  
Transformaciones clave:
- Selección de columnas relevantes
- Eliminación de nulos y duplicados
- Limpieza de texto (regex + normalización)
- Etiquetado de sentimiento desde estrellas:
  - `1–2` → **negativo**
  - `3` → **neutro**
  - `4–5` → **positivo**
- Muestreo estratificado: `500`, `1000`, `5000`, `40000` y dataset completo

### ETL Portugués (PT)
Dataset: reseñas en portugués (CSV).  
Ajustes técnicos importantes:
- Regex adaptada a caracteres válidos del portugués (ã, õ, ç, etc.)
- Normalización y consistencia del contrato del dataset
- Etiquetado final homogéneo en 3 clases (NEGATIVO/NEUTRO/POSITIVO)

---

## Descarga de Datasets y Modelos (Google Drive)

Debido a que los **datasets** y los modelos **Transformer** (**BETO ES** y **RoBERTa PT**) son pesados para versionarlos directamente en GitHub, se publican en Google Drive.

### 📦 Datasets (raw / fuente)
- https://drive.google.com/drive/folders/1ysB-sFLjyOUws0-6nxrQVfnEte1tCzpM?usp=sharing

### 🧠 Datasets de entrenamiento (procesados / listos para modelado)
- https://drive.google.com/drive/folders/1DPqDsuZHAfnFJZ5Ouq5sBN641Q6kbct7?usp=sharing

### 🤖 Modelos entrenados (Transformers)
Incluye:
- BETO (ES)
- RoBERTa (PT)

- https://drive.google.com/drive/folders/1vIM8wnmbrKSLxuLe0-J-CY-MJ2yMiPiq?usp=drive_link

### Recomendación de ubicación local

```bash
data/
├── raw/
└── processed/

models/
├── beto_es/
└── roberta_pt/
