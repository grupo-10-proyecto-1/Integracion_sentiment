# Plan de Implementación CI/CD - GitHub Actions

## Objetivo
Automatizar la verificación del código cada vez que se suban cambios al repositorio. Esto asegura que "lo que funciona en mi máquina" también funcione en un entorno limpio.

## Estrategia de Pipeline (Monorepo)
Crearemos un único archivo de flujo de trabajo (`.github/workflows/ci.yml`) que contendrá 3 trabajos (jobs) paralelos, uno por cada componente. Esto optimiza el tiempo de ejecución.

### 1. Job: BackEnd (Java)
- **Trigger:** Cambios en carpeta `BackEnd/**`.
- **Entorno:** Ubuntu Latest.
- **Pasos:**
    1.  Checkout código.
    2.  Setup Java 17 (Temurin).
    3.  Cache Maven packages (para velocidad).
    4.  Ejecutar `mvn test` (Compilación + Pruebas Unitarias).

### 2. Job: FastAPI (Python)
- **Trigger:** Cambios en carpeta `FastAPI/**`.
- **Entorno:** Ubuntu Latest.
- **Pasos:**
    1.  Checkout código.
    2.  Setup Python 3.10.
    3.  Cache Pip dependencies.
    4.  Instalar dependencias (`pip install -r requirements.txt`).
    5.  (Opcional) Linting o Test simple de carga.

### 3. Job: FrontEnd (Angular)
- **Trigger:** Cambios en carpeta `FrontEnd/**`.
- **Entorno:** Ubuntu Latest.
- **Pasos:**
    1.  Checkout código.
    2.  Setup Node.js 20.
    3.  Cache NPM modules.
    4.  Instalar dependencias (`npm ci`).
    5.  Build de producción (`npm run build`).
    6.  (Opcional) Tests unitarios (`npm test` --headless).

## Beneficios para el Proyecto
1.  **Calidad Garantizada:** Nadie puede romper el build sin darse cuenta.
2.  **Profesionalismo:** Muestra al jurado que usan prácticas de ingeniería modernas.
3.  **Seguridad:** Verifica que las dependencias se instalen correctamente en un entorno limpio (Linux).

## Archivo Entregable
- `.github/workflows/ci-cd.yml`
