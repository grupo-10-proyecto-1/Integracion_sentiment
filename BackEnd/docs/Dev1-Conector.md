El trabajo realizado fue completar persistencia, estadísticas y endpoints auxiliares, manteniendo el MVP simple y estable.

1. Persistencia (H2 file-based)
   Decisión

Se agregó persistencia usando H2 en modo archivo (data\sentimentdb.mv.db), para:

evitar dependencias externas (Postgres/Docker)

permitir persistencia real entre reinicios

simplificar el setup del equipo

Cambios realizados

pom.xml

Se agregó:

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>


application.properties

spring.datasource.url=jdbc:h2:file:./data/sentimentdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

Resultado

Los datos se persisten correctamente

Verificados desde la consola H2

Persisten entre reinicios del backend

2. Entidad persistida
   Entidad: SentimentStat

Se persiste cada request al endpoint /sentiment como un evento independiente.

Campos guardados:

text → texto analizado

prevision → enum (POSITIVO | NEUTRO | NEGATIVO)

probabilidad

createdAt (set con @PrePersist)

Notas:

Se permite texto repetido (cada request representa un evento distinto).

Prevision se guarda como STRING (@Enumerated(EnumType.STRING)).

3. Lógica de guardado

La persistencia se ejecuta:

solo cuando el modo es python

solo después de recibir una respuesta válida del microservicio FastAPI

Si el DS falla:

no se guarda nada

el error se propaga según el GlobalExceptionHandler

4. Endpoint /stats
   Motivo

Implementar la funcionalidad opcional solicitada:

“Estadísticas simples (porcentaje de positivos/negativos en los últimos X comentarios)”

Endpoint
GET /stats?cantidad=X


cantidad: número de registros más recientes a analizar

default y límites controlados en controller

Lógica

Se consultan los últimos X registros ordenados por createdAt DESC

Se cuentan positivos / neutros / negativos

Se calculan porcentajes en rango 0–100

Se redondea a 2 decimales

DTO de respuesta

StatResponseDTO:

limit

total

positivos / neutros / negativos

pctPositivos / pctNeutros / pctNegativos

5. Endpoint /history (plus)
   Motivo

Agregar un endpoint de detalle para:

facilitar pruebas del front

no sobrecargar /stats

mostrar trazabilidad de eventos

Endpoint
GET /history?limit=X

Devuelve

Lista de los últimos X eventos con:

text

prevision

probabilidad

createdAt

Características

solo lectura

limitado por limit

no afecta la lógica principal

6. Decisiones de diseño relevantes

Se permiten textos repetidos (eventos, no deduplicación).

/stats = agregado

/history = detalle

No se implementó cache ni deduplicación (fuera de MVP).

No se agregó paginación avanzada (solo limit).

Diseño preparado para migrar a Postgres si se requiere.

7. Estado actual

Backend funcional

Persistencia validada

Endpoints /sentiment, /stats, /history, /health operativos

Listo para integración con front-end y documentación final