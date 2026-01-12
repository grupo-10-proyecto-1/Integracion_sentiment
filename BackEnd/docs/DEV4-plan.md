# Plan Dev 4 — QA / Docs / Demo

Resumen de tareas y decisiones (guardado para arrancar mañana):

## Objetivo
Preparar los artefactos que sumen puntos en el hackathon: tests básicos, colección Postman, README "Modo Jurado", health endpoints y documentación para demo.

## Tareas (visión breve)
- Tests MockMvc: 400 cuando falta `text`, 200 cuando `text` válido.
- Colección Postman: ejemplos "bonitos" y variable `{{baseUrl}}` → `docs/postman/sentiment.postman_collection.json`.
- README modo jurado: "Quickstart (30s)", Mock mode vs Python mode, ejemplos, troubleshooting.
- Docker (opcional): `Dockerfile` + `docker-compose.yml` placeholder para FastAPI.
- GET /stats (opcional): contador en memoria y endpoint.
- GET /health y /health/model: health básica y ping al modelo cuando `sentiment.mode=python`.

## Estrategia de trabajo
- Empezamos mañana: NO tocaremos `main` directamente.
- Rama sugerida: `feature/dev4-qa` (o `feat/dev4/qa`) — decidir prefieres alguno diferente.
- Flujo recomendado:
  1. Crear la rama desde `main`: `git checkout -b feature/dev4-qa`.
  2. Implementar cambios y tests localmente.
  3. Hacer commits pequeños y claros.
  4. Abrir PR cuando quieras revisión.

## Notas y restricciones
- Evitaremos tocar `pom.xml` si el hackathon exige no añadir dependencias; la mayoría de las tareas son realizables sin cambiar `pom`.
- Para validación automática con `@NotBlank` necesitaríamos `spring-boot-starter-validation` (revisar si quieres tocar `pom`).

## Próximo paso (mañana)
- Crear la rama `feature/dev4-qa` y comenzar por los tests MockMvc y endpoint `/health`.

---

Guardado: lista de tareas y plan para arrancar cuando indiques. Si confirmas la rama, puedo crearla mañana y empezar con los tests.