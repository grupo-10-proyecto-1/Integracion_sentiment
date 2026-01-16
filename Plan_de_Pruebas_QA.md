### **Plan de Pruebas de QA: Integración de Análisis de Sentimiento**

**Versión:** 1.0
**Autor:** Beto (Dev4 - QA)
**Fecha:** 16 de enero de 2026

#### **1. Objetivo General**

Asegurar que la aplicación de análisis de sentimiento funcione de manera correcta, estable y eficiente en todos sus componentes (Frontend, Backend, Modelo ML) y en su conjunto. El foco principal es validar las integraciones y los flujos de usuario de principio a fin (`End-to-End`).

#### **2. Alcance de las Pruebas**

*   **EN ALCANCE:**
    *   Pruebas funcionales de los endpoints del Backend.
    *   Pruebas de integración entre el Backend y el servicio de FastAPI.
    *   Pruebas de integración entre el Frontend y los endpoints del Backend.
    *   Pruebas de los flujos de usuario completos (Análisis individual, Lote, Historial, Estadísticas).
    *   Validación básica de la persistencia de datos (historial).
    *   Manejo de errores y respuestas en la UI.
*   **FUERA DE ALCANCE (para esta fase):**
    *   Pruebas de estrés o carga masiva.
    *   Pruebas de seguridad exhaustivas (pen-testing).
    *   Validación de la precisión del modelo ML (se asume que el modelo es una "caja negra" que entrega un resultado).

#### **3. Estrategia y Tipos de Pruebas**

Se proponen 4 niveles de pruebas:

**3.1. Pruebas de Componentes (A cargo de cada Dev)**

*   **Backend (Java):** Validar que los `Services` y `Controllers` funcionan de forma aislada (usando Mocks para el `SentimentDsClient` y los `Repositories`).
*   **Frontend (Angular):** Validar que los componentes (`sentiment-form`, `sentiment-result`) y servicios (`sentiment.service`) se comportan como se espera de forma aislada (usando `HttpClientTestingModule` y datos mock).
*   **Modelo (Python):** Validar que el script de FastAPI responde correctamente a peticiones directas con diferentes tipos de texto.

**3.2. Pruebas de Integración (Foco principal de QA)**

El objetivo es verificar que los "contratos" entre servicios se cumplen. Se usará **Postman** (o similar) para las pruebas de API.

*   **Caso de Prueba INT-01: Backend <-> Modelo FastAPI**
    *   **Descripción:** Validar que el `SentimentBackendApplication` (a través de `SentimentDsClient`) puede comunicarse con el servicio de FastAPI.
    *   **Pasos:**
        1.  Enviar una petición `POST` al endpoint de análisis del Backend (ej. `/api/sentiment`).
        2.  Verificar que el Backend llama correctamente al servicio de FastAPI.
        3.  Verificar que el Backend procesa la respuesta del modelo (positiva, negativa, neutral) y la devuelve en el formato esperado.
    *   **Escenarios:**
        *   Texto válido (frases positivas, negativas, neutrales).
        *   Conexión fallida con el modelo (¿qué responde el Backend? Debería ser un error 503 o similar).
        *   Timeout del modelo (¿el Backend maneja la espera y responde con un error?).

*   **Caso de Prueba INT-02: Backend <-> Base de Datos**
    *   **Descripción:** Validar que el historial de análisis se guarda y se recupera correctamente.
    *   **Pasos:**
        1.  Realizar un análisis a través del endpoint `/api/sentiment`.
        2.  Llamar al endpoint de historial (ej. `/api/history`).
        3.  Verificar que el análisis realizado en el paso 1 aparece en la respuesta.
    *   **Escenarios:**
        *   Guardado de análisis individual.
        *   Guardado de análisis por lote (`/api/batch/sentiment`).
        *   Consulta de historial vacío.
        *   Consulta de historial con múltiples registros.

*   **Caso de Prueba INT-03: Frontend <-> Backend**
    *   **Descripción:** Validar que la aplicación de Angular se comunica correctamente con todos los endpoints del Backend.
    *   **Pasos:** Usando la aplicación web, interactuar con las funcionalidades y verificar en las herramientas de desarrollador del navegador (pestaña Network) que las llamadas a la API se realizan correctamente.
    *   **Escenarios:**
        *   Llamada al `/api/sentiment` al enviar el formulario.
        *   Llamada al `/api/history` al cargar la página de historial.
        *   Llamada al `/api/stats` al cargar el componente de métricas.
        *   Manejo de errores: ¿Qué muestra la UI si el backend devuelve un error 4xx o 5xx?

**3.3. Pruebas End-to-End (E2E) - Flujo de Usuario**

Simulan la experiencia de un usuario real. Se pueden automatizar con herramientas como **Cypress** o **Selenium**.

*   **Caso de Prueba E2E-01: Flujo de Análisis de Sentimiento Individual**
    1.  Abrir la aplicación web.
    2.  Navegar a la sección de análisis.
    3.  Introducir el texto "Me encanta este producto" en el formulario.
    4.  Hacer clic en "Analizar".
    5.  **Resultado esperado:** La UI muestra un indicador de "Cargando..." y luego presenta un resultado "Positivo" (o similar) con su puntuación. La llamada al historial (`/api/history`) debe contener este nuevo registro.

*   **Caso de Prueba E2E-02: Flujo de Análisis con Texto Negativo**
    1.  Repetir E2E-01 con el texto "El servicio fue terrible".
    2.  **Resultado esperado:** La UI muestra un resultado "Negativo" con su puntuación.

*   **Caso de Prueba E2E-03: Visualización de Historial y Estadísticas**
    1.  Navegar a la página de "Historial".
    2.  **Resultado esperado:** Se muestran los análisis de los casos E2E-01 y E2E-02.
    3.  Navegar a la página o sección de "Estadísticas".
    4.  **Resultado esperado:** Las métricas reflejan 1 análisis positivo y 1 negativo.

**3.4. Pruebas No Funcionales**

*   **Usabilidad (UX/UI):**
    *   ¿Son claros los mensajes de error?
    *   ¿El flujo de la aplicación es intuitivo?
    *   ¿La retroalimentación visual (spinners de carga, notificaciones) es adecuada?
*   **Compatibilidad:**
    *   Probar en los navegadores web más comunes (Chrome, Firefox).

#### **4. Entorno y Herramientas**

*   **Entorno:** Se utilizará la configuración de `docker-compose` en un entorno limpio para levantar toda la infraestructura (Frontend, Backend, Modelo, Base de Datos).
*   **Herramientas Sugeridas:**
    *   **Postman:** Para pruebas de API (Integración).
    *   **Navegador (Herramientas de Desarrollador):** Para inspección de tráfico Frontend <-> Backend.
    *   **Cypress/Selenium:** (Opcional) Para automatización de pruebas E2E.
