# Plan de Pruebas y Guía de Ejecución de QA

**Versión:** 3.0 (Final - Ejecutado)
**Autor:** Beto (Dev4 - QA)
**Fecha:** 18 de enero de 2026

---

### **1. Objetivo General**

Asegurar que la aplicación de análisis de sentimiento funcione de manera correcta, estable y eficiente en todos sus componentes (Frontend, Backend, Modelo ML) y en su conjunto. Este documento sirve como un plan maestro y una guía de ejecución paso a paso para todas las actividades de QA.

---

### **2. Alcance y Estrategia de Pruebas**

#### **2.1. Alcance**

*   **EN ALCANCE:**
    *   Pruebas funcionales de los endpoints del Backend (API).
    *   Pruebas de integración entre todos los servicios (Frontend, Backend, Modelo, DB).
    *   Pruebas de los flujos de usuario completos (End-to-End).
    *   Validación de la persistencia de datos (historial) y actualización de estadísticas.
    *   Validación del manejo de errores en la API y en la interfaz de usuario.
*   **FUERA DE ALCANCE (para esta fase):**
    *   Pruebas de estrés, carga o rendimiento.
    *   Pruebas de seguridad exhaustivas (pen-testing).
    *   Validación de la precisión algorítmica del modelo ML (se trata como una caja negra).

#### **2.2. Estrategia de Pruebas**

La estrategia es ejecutar las pruebas en fases incrementales, asegurando primero los cimientos (entorno y conectividad) antes de validar la lógica de negocio y la experiencia del usuario.

1.  **Configuración del Entorno:** Preparar un entorno de pruebas consistente usando Docker.
2.  **Pruebas de Humo (Smoke Tests):** Verificar que todos los servicios se inicien y sean accesibles.
3.  **Pruebas de Integración (Nivel API):** Validar los "contratos" y la comunicación directa entre servicios usando Postman.
4.  **Pruebas End-to-End (Nivel UI):** Validar los flujos de usuario completos desde el navegador, simulando la experiencia real.
5.  **Pruebas Finales:** Una revisión rápida de regresión y usabilidad.

---

### **3. Configuración del Entorno de Pruebas**

**Meta:** Asegurar que toda la aplicación está correctamente desplegada y accesible para las pruebas.

*   **Paso 1: Levantar el Stack Completo**
    *   **Acción:** Abre una terminal en la raíz del proyecto y ejecuta el comando:
      ```bash
      docker-compose up --build
      ```
    *   **Verificación:** Espera a que todos los servicios (`frontend`, `backend`, `fastapi`, `db`) terminen de construir e iniciarse. Los logs no deben mostrar errores críticos de arranque.

*   **Paso 2: Verificar Contenedores en Ejecución**
    *   **Acción:** Abre una segunda terminal y ejecuta `docker ps`.
    *   **Verificación:** Confirma que los contenedores para `sentiment-frontend`, `sentiment-backend`, `sentiment-model` y la base de datos están en estado `Up` o `Running`.

---

### **4. Ejecución de Pruebas (Guía Paso a Paso)**

#### **Fase 1: Pruebas de Humo (Smoke Tests)**

**Meta:** Confirmar que todos los servicios están "vivos" y accesibles.

*   **Acción:** Abre tu navegador web y comprueba los siguientes puntos de acceso:
    1.  **Frontend App:** `http://localhost:4200`
    2.  **Backend Docs:** `http://localhost:8080/swagger-ui/index.html`
    3.  **Modelo Docs:** `http://localhost:8000/docs`
*   **Verificación:**
    *   La aplicación web de Angular debe cargar sin errores en la consola.
    *   La documentación de Swagger UI del Backend debe ser visible.
    *   La documentación de la API de FastAPI debe ser visible.

#### **Fase 2: Pruebas de Integración (Nivel API con Postman)**

**Meta:** Validar que los servicios se comunican correctamente entre sí.

*   **INT-01: Backend <-> Modelo (Happy Path)**
    *   **Acción:** En Postman, envía una petición `POST` a `http://localhost:8080/api/sentiment` con el siguiente `body` (raw, JSON):
      ```json
      { "text": "Este producto es absolutamente maravilloso." }
      ```
    *   **Verificación:** Recibir una respuesta `200 OK` con un JSON que contenga `"sentiment": "POSITIVE"`.

*   **INT-02: Backend <-> Base de Datos (Persistencia)**
    *   **Acción:** En Postman, envía una petición `GET` a `http://localhost:8080/api/history`.
    *   **Verificación:** Recibir una respuesta `200 OK` con un array JSON que contenga el análisis realizado en `INT-01`.

*   **INT-03: Backend <-> Modelo (Manejo de Error)**
    *   **Acción:**
        1. Detén el contenedor del modelo: `docker-compose stop sentiment-model`.
        2. Repite la petición del caso `INT-01`.
    *   **Verificación:** Recibir un error `5xx` (ej. `503 Service Unavailable` o `500 Internal Server Error`), confirmando que el Backend maneja la falla de su dependencia.
    *   **Limpieza:** Reinicia el contenedor: `docker-compose start sentiment-model`.


#### **Fase 3: Pruebas End-to-End (Nivel UI)**

**Meta:** Validar los flujos de usuario completos desde el navegador.

*   **E2E-01: Flujo de Análisis (Positivo)**
    *   **Acción:** En `http://localhost:4200`, introduce "Me encanta este nuevo diseño, es muy fácil de usar" y haz clic en "Analizar".
    *   **Verificación:** La UI muestra un spinner de carga y luego una tarjeta de resultado marcando el sentimiento como "Positivo".

*   **E2E-02: Flujo de Análisis (Negativo)**
    *   **Acción:** Introduce "La página es muy lenta y no encuentro nada" y haz clic en "Analizar".
    *   **Verificación:** La UI muestra un resultado "Negativo".

*   **E2E-03: Flujo de Análisis (Neutral)**
    *   **Acción:** Introduce "El reporte será entregado mañana" y haz clic en "Analizar".
    *   **Verificación:** La UI muestra un resultado "Neutral".

*   **E2E-04: Validación de Historial y Métricas en UI**
    *   **Acción:** Refresca la página.
    *   **Verificación:**
        1. Las tarjetas de resultados bajo el formulario deben mostrar los 3 análisis anteriores.
        2. El componente de métricas debe reflejar las estadísticas correctas (1 Positivo, 1 Negativo, 1 Neutral).

*   **E2E-05: Manejo de Errores en UI (Backend caído)**
    *   **Acción:**
        1. Detén el backend: `docker-compose stop sentiment-backend`.
        2. Intenta realizar un nuevo análisis desde la UI.
    *   **Verificación:** La aplicación no debe romperse. Debe mostrar un mensaje de error claro al usuario (ej. "Error al contactar el servidor").
    *   **Limpieza:** Reinicia el backend: `docker-compose start sentiment-backend`.

#### **Fase 4: Pruebas Finales**

*   **REG-01: Prueba de Regresión Rápida**
    *   **Acción:** Repite el caso `E2E-01`.
    *   **Verificación:** Confirmar que la funcionalidad principal sigue intacta después de reiniciar servicios.

*   **UX-01: Revisión de Usabilidad**
    *   **Acción:** Navega por toda la aplicación.
    *   **Verificación:** Revisa que los textos sean claros, que no haya errores de tipeo, que los elementos estén bien alineados y que la experiencia general sea fluida e intuitiva.