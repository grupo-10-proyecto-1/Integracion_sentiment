# Bitácora de Avance - Equipo Dev 4 (QA & Docs)

Este documento sirve como registro de las actividades realizadas, decisiones tomadas y soluciones implementadas por el equipo de QA y Documentación.

---

## 📅 Sesión 1: Preparación para Demo y Calidad Base

### 🎯 Objetivos
Cumplir con los entregables definidos en `TareasSeman1.txt` para el rol Dev 4: Tests, Documentación, Postman y Docker.

### ✅ Tareas Realizadas

1.  **Refactorización del README (Modo Jurado)**
    *   **Acción:** Se limpió el archivo `README.md` eliminando instrucciones redundantes y enfocándolo en la experiencia del usuario/jurado.
    *   **Resultado:** Un "Quickstart" de 30 segundos, documentación clara de los modos de ejecución (Mock vs Python) y troubleshooting.

2.  **Automatización de Pruebas (MockMvc)**
    *   **Acción:** Creación de `SentimentControllerMockMvcTest.java`.
    *   **Resultado:** 
        *   Test de éxito (200 OK) para asegurar que el flujo principal funciona.
        *   Test de fallo (400 Bad Request) para validar que el sistema rechaza inputs vacíos (robustez).

3.  **Contenedorización (Docker)**
    *   **Acción:** Creación del `Dockerfile` optimizado (Multi-stage build).
    *   **Resultado:** Imagen ligera basada en Alpine Linux que compila y ejecuta la app sin necesitar Maven instalado en el host.

4.  **Kit de Pruebas Manuales (Postman)**
    *   **Acción:** Generación de `Sentiment_Analysis.postman_collection.json`.
    *   **Mejoras:** 
        *   Uso de variable `{{baseUrl}}` para flexibilidad.
        *   Inclusión de casos de borde (texto vacío) y casos de negocio (positivo/negativo).
        *   Agregado endpoint `/health`.

### ⚠️ Problemas y Soluciones

| Problema / Desafío | Solución Implementada |
| :--- | :--- |
| **Legibilidad del README:** El archivo original era muy técnico y difícil de seguir para una demo rápida. | Se reestructuró priorizando los comandos de ejecución rápida y separando la configuración avanzada. |
| **Dependencia de Entorno:** Ejecutar tests manuales repetitivamente es propenso a errores. | Se implementaron tests unitarios de controlador (`MockMvc`) que se ejecutan con `./mvnw test`. |
| **Hardcoding en Postman:** Las URLs fijas complicaban probar si cambiaba el puerto o el host. | Se refactorizó la colección para usar variables de entorno. |

### 🔜 Próximos Pasos (Pendientes)

*   [ ] Ejecutar pruebas de integración completas una vez que Dev 1 conecte el servicio de Python real.
*   [ ] Validar el levantamiento del stack completo con `docker-compose` cuando el servicio de IA esté disponible.

---

## 🚀 Estado de Entrega (Rama: tOLEDOdEV4-qa)

**Estatus:** Listo para Merge Request (PR).

Se ha verificado que todos los artefactos (Código, Tests, Docker, Documentación) cumplen con los criterios de aceptación del rol Dev 4.

- **Código:** Comentado y estructurado (JavaDoc agregado).
- **Tests:** Unitarios (MockMvc) y Manuales (Postman) listos.
- **Docs:** README orientado al jurado y Bitácora actualizada.

---

## 📅 Sesión 2: Despliegue Unificado y Corrección de Errores

### 🎯 Objetivos
Unificar los tres componentes (Backend, Frontend, FastAPI) en un solo despliegue orquestado y solucionar problemas de conectividad en producción.

### ✅ Tareas Realizadas

1.  **Orquestación Completa (Docker Compose)**
    *   **Acción:** Se creó un `docker-compose.yml` maestro en la raíz.
    *   **Resultado:** Levantamiento simultáneo de Backend, Frontend, FastAPI y Nginx con un solo comando.

2.  **Configuración de Reverse Proxy (Nginx)**
    *   **Acción:** Implementación de Nginx para enrutar tráfico: `/` al Frontend y `/api` al Backend.
    *   **Resultado:** Eliminación de problemas de CORS y simplificación de URLs.

3.  **Corrección de Conectividad Backend-FastAPI**
    *   **Problema:** El Backend no podía contactar al modelo de Python ("API DESCONECTADA").
    *   **Solución:**
        *   Se forzó el uso de variables de entorno en `application.properties`: `python.api.base-url=${PYTHON_API_BASE_URL...}`.
        *   Se expuso el puerto 8000 para depuración.

4.  **Corrección de Configuración Frontend**
    *   **Problema:** El Frontend apuntaba a una URL placeholder `https://TU-BACKEND.com`.
    *   **Solución:** Se actualizó `environment.ts` para apuntar a `/api`, aprovechando el proxy de Nginx.

### ⚠️ Problemas y Soluciones

| Problema / Desafío | Solución Implementada |
| :--- | :--- |
| **Error Docker Pipe:** `open //./pipe/dockerDesktopLinuxEngine...` | Se identificó que Docker Desktop no estaba corriendo. Solución: Iniciar Docker. |
| **Conflicto de Contenedores:** Error al levantar `sentiment-backend` por nombre duplicado. | Se eliminó el contenedor huérfano con `docker rm -f`. |
| **API Desconectada (Frontend):** La UI mostraba error de conexión persistente. | Se corrigió la URL base en `environment.ts` de `https://TU-BACKEND.com` a `/api`. |