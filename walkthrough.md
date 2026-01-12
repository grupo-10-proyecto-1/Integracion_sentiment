# Walkthrough: Despliegue Unificado con Docker

He unificado los tres componentes del proyecto (Backend, Frontend, FastAPI) para que funcionen juntos en un entorno de producción utilizando Docker Compose.

## Cambios Realizados

1.  **Frontend**:
    *   Se creó un `Dockerfile` en `FrontEnd/` para compilar la aplicación Angular y servirla con Nginx.
    *   Se añadió `nginx.conf` en `FrontEnd/` para manejar el enrutamiento SPA (Single Page Application).

2.  **Orquestación (Root)**:
    *   Se creó `docker-compose.yml` en la raíz del proyecto. Este archivo define los servicios:
        *   `sentiment-backend`: API Java Spring Boot.
        *   `sentiment-model`: Modelo de IA en Python FastAPI.
        *   `sentiment-frontend`: UI Angular.
        *   `nginx-proxy`: Servidor Nginx principal que redirige el tráfico.
    *   Se creó `nginx.conf` en la raíz para configurar el proxy inverso:
        *   `http://localhost/` -> Frontend
        *   `http://localhost/api/` -> Backend

## Cómo Ejecutar el Proyecto

1.  Asegúrate de tener Docker y Docker Compose instalados.
2.  Abre una terminal en la raíz del proyecto (`d:\proyectos_y_trabajos\Integracion_sentiment`).
3.  Ejecuta el siguiente comando para construir y levantar los servicios:

    ```bash
    docker-compose up --build
    ```

4.  Una vez que los contenedores estén corriendo, abre tu navegador y visita:
    *   **http://localhost**

## Verificación
*   La aplicación web debería cargar correctamente.
*   Las peticiones al backend deberían funcionar a través de `/api`.
*   El backend debería poder comunicarse con el modelo de Python internamente.

## Notas
*   Si necesitas detener los servicios, usa `Ctrl+C` o ejecuta `docker-compose down`.
*   Si haces cambios en el código, vuelve a ejecutar `docker-compose up --build` para reconstruir las imágenes.

## Solución de Problemas (Troubleshooting)

### 1. Error "API DESCONECTADA" en el Frontend
Si la aplicación muestra este mensaje en rojo:
*   **Causa:** El Frontend no puede contactar al Backend.
*   **Solución:** Verifica que `FrontEnd/src/environments/environment.ts` tenga `baseUrl: '/api'`. Si tiene una URL completa como `https://TU-BACKEND.com`, cámbiala.

### 2. Error de Conexión Docker
Si ves `open //./pipe/dockerDesktopLinuxEngine...`:
*   **Causa:** Docker Desktop no está corriendo.
*   **Solución:** Inicia Docker Desktop y espera a que el icono de la ballena esté fijo.

### 3. Conflicto de Nombres
Si ves `Conflict. The container name "/sentiment-backend" is already in use`:
*   **Solución:** Ejecuta `docker rm -f sentiment-backend` (o el nombre del contenedor conflictivo) y vuelve a intentar.
