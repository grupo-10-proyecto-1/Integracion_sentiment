# Plan de Despliegue a Producción - Integración Sentiment

Este plan detalla los pasos para unificar y desplegar los tres componentes del sistema (Backend Java, Modelo Python, Frontend Angular) en un entorno de producción utilizando Docker y Docker Compose.

## Objetivo
Lograr que `docker-compose up` levante todo el sistema funcional, accesible vía web.

## Estrategia de Arquitectura
Utilizaremos una arquitectura de contenedores orquestada:

1.  **Reverse Proxy (Nginx)**: Punto de entrada único.
    *   Ruta `/` -> Sirve el Frontend (Angular).
    *   Ruta `/api` -> Redirige al Backend (Spring Boot).
    *   Esto elimina problemas de CORS y simplifica la configuración de dominios.
2.  **Backend (Spring Boot)**: API principal.
    *   Se comunica internamente con el servicio de IA.
3.  **Model Service (FastAPI)**: Microservicio de IA.
    *   Accesible solo desde el Backend (red interna).
4.  **Frontend (Angular)**: Interfaz de usuario.
    *   Construido estáticamente y servido por Nginx.

## Cambios Propuestos

### 1. FrontEnd
#### [MODIFY] [Dockerfile](file:///d:/proyectos_y_trabajos/Integracion_sentiment/FrontEnd/Dockerfile)
*   Actualmente está vacío.
*   **Acción**: Crear un Dockerfile "Multi-stage":
    *   Stage 1 (Node): Compila el proyecto Angular (`npm run build`).
    *   Stage 2 (Nginx): Sirve los archivos estáticos generados.

### 2. Raíz del Proyecto
#### [NEW] [docker-compose.yml](file:///d:/proyectos_y_trabajos/Integracion_sentiment/docker-compose.yml)
*   Archivo maestro que define los 3 servicios + Nginx.
*   Configura redes y variables de entorno.

#### [NEW] [nginx.conf](file:///d:/proyectos_y_trabajos/Integracion_sentiment/nginx.conf)
*   Configuración para enrutar el tráfico entre el Frontend y el Backend.

### 3. BackEnd
#### [MODIFY] [docker-compose.yml](file:///d:/proyectos_y_trabajos/Integracion_sentiment/BackEnd/docker-compose.yml)
*   (Opcional) Podemos mantenerlo para desarrollo aislado, o eliminarlo para evitar confusión. Por ahora, lo dejaremos como referencia.

## Verificación
1.  Ejecutar `docker-compose up --build`.
2.  Acceder a `http://localhost` (o IP del servidor).
3.  Probar flujo completo: UI -> Backend -> FastAPI -> Backend -> UI.
