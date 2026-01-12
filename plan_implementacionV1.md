# Plan de Integración y Pruebas - Integracion_sentiment

## Estado Actual del Proyecto

### 1. BackEnd (Java/Spring Boot)
- **Tecnología**: Java 17, Spring Boot 3.2.4.
- **Base de Datos**: H2 (Memoria/Runtime).
- **Dependencias Clave**: Web, Data JPA, Validation, Actuator.
- **Estado**: Código fuente presente, scripts de prueba ([test_api.sh](file:///d:/proyectos_y_trabajos/Integracion_sentiment/BackEnd/test_api.sh)) disponibles.
- **Puerto Esperado**: 8080 (por defecto en Spring Boot).

### 2. FastAPI (Python)
- **Tecnología**: Python, FastAPI, Scikit-learn, Joblib.
- **Modelos**: Modelos pre-entrenados para Español ([es](file:///d:/proyectos_y_trabajos/Integracion_sentiment/BackEnd/.gitattributes)) y Portugués (`pt`).
- **Endpoints**: `/predict` (POST), `/health` (GET).
- **Estado**: Código listo, requiere instalación de dependencias ([requirements.txt](file:///d:/proyectos_y_trabajos/Integracion_sentiment/FastAPI/requirements.txt)).
- **Puerto Esperado**: 8000 (por defecto en FastAPI/Uvicorn).

### 3. FrontEnd (Angular)
- **Tecnología**: Angular 17, Tailwind CSS.
- **Estructura**: Modular (`core`, `features`, `shared`).
- **Estado**: Configuración lista ([package.json](file:///d:/proyectos_y_trabajos/Integracion_sentiment/FrontEnd/package.json)), requiere instalación de dependencias (`npm install`).
- **Puerto Esperado**: 4200 (por defecto en Angular).

## Estrategia de Pruebas Propuesta

### 1. Configuración de Entorno
- **Objetivo**: Levantar todos los servicios simultáneamente.
- **Pasos**:
    1.  **FastAPI**: Crear entorno virtual, instalar dependencias, ejecutar servidor.
    2.  **BackEnd**: Compilar con Maven, ejecutar aplicación Spring Boot.
    3.  **FrontEnd**: Instalar dependencias Node, ejecutar servidor de desarrollo.

### 2. Pruebas Unitarias y de Funcionamiento
- **BackEnd**: Ejecutar `mvn test` para validar lógica interna.
- **FastAPI**: Verificar carga de modelos y respuesta de endpoints con scripts simples o `curl`.
- **FrontEnd**: Ejecutar `ng test` (Karma/Jasmine) para componentes.

### 3. Pruebas de Integración
- **Flujo**: FrontEnd -> BackEnd -> FastAPI.
- **Verificación**:
    - Validar que el BackEnd se comunique correctamente con el servicio FastAPI.
    - Validar que el FrontEnd envíe datos al BackEnd y muestre la respuesta correctamente.
- **Herramientas**: Postman (colecciones existentes), Scripts Bash ([test_api.sh](file:///d:/proyectos_y_trabajos/Integracion_sentiment/BackEnd/test_api.sh)).

### 4. Pruebas Manuales (E2E y Smoke)
- **Smoke Test**: Verificar `/health` de todos los servicios.
- **E2E**:
    - Abrir aplicación web.
    - Ingresar texto en español (positivo/negativo).
    - Verificar resultado visual.
    - Repetir para portugués.
    - Verificar manejo de errores (texto vacío, idioma no soportado).

## Plan de Ejecución

1.  **Preparación**: Instalar dependencias en todos los módulos.
2.  **Ejecución Unitaria**: Correr tests unitarios existentes.
3.  **Despliegue Local**: Levantar los 3 servicios.
4.  **Validación**: Ejecutar scripts de prueba y validación manual.
