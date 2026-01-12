# 📢 Novedades e Instrucciones para el Moderador

## 📦 Estandarización de Paquetes (Semana 2)

**Cambio:** Renombrado del paquete base de `com.sentiment.demo` a `com.sentiment.backend`.

### 📝 Justificación
El proyecto evolucionó de ser una prueba de concepto ("demo") a ser el backend oficial del sistema de análisis de sentimientos.

1.  **Consistencia:** El `artifactId` en Maven se actualizó a `sentiment-backend`. El paquete Java debe coincidir con esta identidad para evitar confusiones.
2.  **Semántica:** El término "demo" en el código fuente sugiere temporalidad o falta de robustez. "Backend" describe la responsabilidad del componente en la arquitectura.
3.  **Mantenibilidad:** Facilita la identificación de componentes en un entorno de microservicios donde podrían existir otros artefactos (ej. `sentiment-dashboard`).

### ⚠️ Impacto Técnico
- Se requiere mover los archivos fuente en `src/main/java` y `src/test/java`.
- Se actualizaron las declaraciones `package` en las clases afectadas.
- **QA:** Los tests de integración (`SentimentControllerTest`) se han migrado para validar este cambio.

---

## 🔍 Observación de Calidad (Deuda Técnica)

**Hallazgo:** Error de tipeo en el nombre de la clase principal.
`Found @SpringBootConfiguration com.sentiment.backend.SentimentProyectApplication`

**Detalle:**
El nombre de la clase principal tiene un error de tipeo ("Proyect" en lugar de "Project" o "Backend").

**Estado Actual:** Funciona, no rompe nada.

**Recomendación:** Dado que estamos "limpiando" la casa para el jurado, sería ideal renombrarlo a `SentimentBackendApplication` para que coincida con el `artifactId` del `pom.xml`, pero **no es bloqueante**.

---
*Saludos Dev 4 - QA / Omar Toledo*