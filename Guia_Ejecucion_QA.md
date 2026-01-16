# Guía de Ejecución de Pruebas QA (Paso a Paso)

**Autor:** Beto (Dev4 - QA)
**Objetivo:** Validar la funcionalidad e integración de la aplicación de Análisis de Sentimiento de manera estructurada y secuencial.

---

### **Fase 1: Preparación y Verificación del Entorno**

**Meta:** Asegurar que toda la aplicación está correctamente desplegada y accesible.

*   **Paso 1.1: Levantar el Stack Completo**
    *   **Acción:** En la raíz del proyecto, ejecuta `docker-compose up --build`.
    *   **Verificación:** Espera a que todos los servicios (frontend, backend, fastapi, db) terminen de construir e iniciarse. Los logs no deben mostrar errores críticos de arranque.

*   **Paso 1.2: Verificar Contenedores**
    *   **Acción:** Abre una nueva terminal y ejecuta `docker ps`.
    *   **Verificación:** Confirma que los contenedores para `sentiment-frontend`, `sentiment-backend`, `sentiment-model` y la base de datos están en estado `Up` o `Running`.

*   **Paso 1.3: Pruebas de Humo (Smoke Tests)**
    *   **Acción:** Abre tu navegador web y comprueba los siguientes puntos de acceso:
        1.  **Frontend:** Ve a `http://localhost:4200`.
        2.  **Backend Docs:** Ve a `http://localhost:8080/swagger-ui/index.html`.
        3.  **Modelo Docs:** Ve a `http://localhost:8000/docs`.
    *   **Verificación:** La página del frontend debe cargar. Las páginas de documentación de Swagger (Backend) y FastAPI deben mostrarse correctamente. Esto confirma que los servicios están "vivos".

---

### **Fase 2: Pruebas de Integración (Nivel API)**

**Meta:** Validar que los servicios se comunican correctamente entre sí.
**Herramienta:** Postman o una herramienta similar para hacer peticiones API.

*   **Paso 2.1: Probar Integración Backend <-> Modelo FastAPI**
    *   **Acción:** En Postman, crea una petición `POST` a `http://localhost:8080/api/sentiment`.
    *   En el `Body` de la petición, selecciona `raw` y `JSON`, y usa este contenido:
        ```json
        {
          "text": "Este producto es absolutamente maravilloso."
        }
        ```
    *   **Verificación:** Debes recibir una respuesta `200 OK` con un JSON que contenga `"sentiment": "POSITIVE"`. Esto confirma que el Backend pudo comunicarse con el Modelo y obtener una respuesta.

*   **Paso 2.2: Probar Integración Backend <-> Base de Datos**
    *   **Acción:** En Postman, crea una petición `GET` a `http://localhost:8080/api/history`.
    *   **Verificación:** Debes recibir una respuesta `200 OK` y el `body` debe ser un array JSON que contenga el resultado del análisis que realizaste en el paso 2.1. Esto confirma la persistencia de datos.

*   **Paso 2.3: Probar Manejo de Error de Integración**
    *   **Acción:**
        1.  Detén el contenedor del modelo: `docker stop <container_id_del_modelo>`.
        2.  Repite la petición del paso 2.1.
    *   **Verificación:** El Backend ya no puede comunicarse con el modelo. Debes recibir un error del lado del servidor (ej. `503 Service Unavailable` o `500 Internal Server Error`). Esto confirma que el Backend maneja fallos en sus dependencias.
    *   **Limpieza:** Vuelve a iniciar el contenedor del modelo: `docker start <container_id_del_modelo>`.

---

### **Fase 3: Pruebas End-to-End (Nivel Interfaz de Usuario)**

**Meta:** Validar los flujos de usuario completos desde el navegador.
**Herramienta:** Navegador Web.

*   **Paso 3.1: Flujo de Análisis "Happy Path"**
    *   **Acción:**
        1.  Ve a `http://localhost:4200`.
        2.  En el formulario, introduce un texto positivo como "Me encanta este nuevo diseño, es muy fácil de usar".
        3.  Haz clic en el botón "Analizar".
    *   **Verificación:** La UI debe mostrar un estado de "cargando" y luego presentar la tarjeta de resultado, marcando el sentimiento como "Positivo" y mostrando una probabilidad alta.

*   **Paso 3.2: Flujo de Análisis Negativo**
    *   **Acción:** Repite el paso 3.1, pero con un texto negativo como "La página es muy lenta y no encuentro nada".
    *   **Verificación:** El resultado en la UI debe ser "Negativo".

*   **Paso 3.3: Verificación de UI con API Caída**
    *   **Acción:**
        1.  Detén el contenedor del backend: `docker stop <container_id_del_backend>`.
        2.  Intenta realizar un análisis desde el frontend.
    *   **Verificación:** La aplicación no debe "romperse". En su lugar, debe mostrar un mensaje de error claro al usuario (ej. "No se pudo conectar con el servidor, intente más tarde").
    *   **Limpieza:** Vuelve a iniciar el contenedor del backend: `docker start <container_id_del_backend>`.

---

### **Fase 4: Pruebas de Regresión y Usabilidad**

**Meta:** Realizar una última revisión para asegurar la calidad general.

*   **Paso 4.1: Prueba de Regresión Rápida**
    *   **Acción:** Repite el paso 3.1 (el "Happy Path").
    *   **Verificación:** Confirmar que la funcionalidad principal sigue funcionando después de haber detenido y reiniciado los contenedores.

*   **Paso 4.2: Revisión de Usabilidad (UX/UI)**
    *   **Acción:** Navega por toda la aplicación.
    *   **Verificación:** Revisa que los textos sean claros, que no haya errores de tipeo, que los botones y elementos estén bien alineados en escritorio y móvil, y que la experiencia general sea fluida.
