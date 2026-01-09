# 📘 Documentación Técnica Formal - Integración Sentiment Analysis

## 1. Resumen Ejecutivo
El sistema **Sentiment Analysis Integration** es una solución de arquitectura de microservicios diseñada para procesar, analizar y clasificar el sentimiento de textos en tiempo real. Combina la robustez empresarial de Java Spring Boot con la potencia analítica de Python y la interactividad moderna de Angular.

## 2. Arquitectura del Sistema
El sistema sigue un patrón de arquitectura distribuida con tres componentes principales desacoplados:

### 2.1. FrontEnd (Capa de Presentación)
- **Tecnología:** Angular 17 + Tailwind CSS.
- **Responsabilidad:** Interfaz de usuario reactiva para la captura de datos y visualización de resultados. Implementa validaciones tempranas y manejo de errores amigable.
- **Comunicación:** Consume la API REST del BackEnd mediante cliente HTTP asíncrono.

### 2.2. BackEnd (Capa de Negocio e Integración)
- **Tecnología:** Java 17 + Spring Boot 3.2.4.
- **Responsabilidad:**
    - Actúa como API Gateway y orquestador.
    - Gestiona la lógica de negocio, validaciones de seguridad y persistencia de métricas.
    - Implementa patrones de resiliencia (Reintentos y manejo de fallos) para la comunicación con el servicio de IA.
- **Persistencia:** Base de datos H2 (en memoria) para almacenamiento transaccional de historial y estadísticas.

### 2.3. Data Science Service (Capa de Inteligencia)
- **Tecnología:** Python 3.10 + FastAPI + Scikit-learn.
- **Responsabilidad:** Exponer modelos de Machine Learning entrenados (Regresión Logística) para la clasificación de texto en Español y Portugués.
- **Performance:** Serialización de modelos con Joblib para inferencia de baja latencia.

## 3. Flujo de Datos (Data Flow)
1.  **Input:** El usuario ingresa texto en el FrontEnd.
2.  **Request:** Angular envía `POST /sentiment` al BackEnd (Java).
3.  **Orquestación:** Java valida el input y redirige la petición al microservicio Python (`POST /predict`).
4.  **Inferencia:** Python detecta el idioma, selecciona el modelo adecuado y retorna la predicción (`POSITIVO`/`NEGATIVO` + Probabilidad).
5.  **Persistencia:** Java recibe la predicción, guarda la métrica en H2 y retorna la respuesta al FrontEnd.
6.  **Visualización:** Angular muestra el resultado con indicadores visuales de confianza.

## 4. Tecnologías y Herramientas
- **Lenguajes:** Java 17, Python 3.10, TypeScript 5.
- **Frameworks:** Spring Boot 3.2.4, FastAPI 0.109, Angular 17.
- **Librerías de IA:** Scikit-learn, Joblib, Langdetect.
- **Build Tools:** Maven, NPM.
- **Base de Datos:** H2 Database Engine.

## 5. DevOps & CI/CD
Para garantizar la calidad y estabilidad del código, se ha implementado un pipeline de Integración Continua (CI) utilizando **GitHub Actions**.

### Pipeline Automatizado (`.github/workflows/ci-cd.yml`)
Cada vez que se realiza un `push` o `pull_request` a la rama principal, se ejecutan 3 trabajos en paralelo:

1.  **BackEnd Job:**
    -   Configura entorno Java 17.
    -   Ejecuta `mvn test` para validar compilación y pruebas unitarias.
2.  **FastAPI Job:**
    -   Configura entorno Python 3.10.
    -   Instala dependencias y verifica integridad del entorno.
3.  **FrontEnd Job:**
    -   Configura entorno Node.js 20.
    -   Ejecuta `npm run build` para asegurar que la aplicación compila correctamente para producción.

Esto asegura que ningún código roto llegue a producción.
