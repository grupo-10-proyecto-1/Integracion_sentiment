# Guía de QA y pruebas (versión clara y útil)

Este documento complementa el README con pasos detallados para que cualquier persona del equipo pueda correr pruebas, entender errores comunes y agregar nuevos tests.

## Objetivo

Probar que el endpoint `POST /sentiment` valida entrada y responde con la estructura esperada.

### Casos mínimos que cubrimos
- `whenMissingText_thenReturns400`: enviar `{}` devuelve 400.
- `whenValidText_thenReturns200`: enviar `{ "text": "..." }` devuelve 200 y fields `prevision` y `probabilidad`.

## Cómo ejecutar los tests localmente

1. Abrir terminal en la raíz del proyecto.
2. (Opcional) Asegurarse que la sesión use JDK21:

   PowerShell:
   ```powershell
   $env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'
   $env:Path = "$env:JAVA_HOME\bin;" + $env:Path
   java -version
   .\mvnw.cmd -v
   ```

   Bash:
   ```bash
   export JAVA_HOME=/usr/lib/jvm/jdk-21
   export PATH="$JAVA_HOME/bin:$PATH"
   java -version
   ./mvnw -v
   ```

3. Ejecutar los tests de la clase de ejemplo:

   Windows:
   ```powershell
   .\mvnw.cmd -Dtest=SentimentControllerMockMvcTest test
   ```

   Linux:
   ```bash
   ./mvnw -Dtest=SentimentControllerMockMvcTest test
   ```

4. Interpretar la salida:

- Si ves `Tests run: 2, Failures: 0`: todo bien.
- Si falla por "class file version ...": ver sección Troubleshooting en README (apuntar a JDK21).
- Si falla por jsonPath: revisá el body que devuelve el controller (MockMvc lo imprime en los logs) y ajustá la aserción.

## Añadir un nuevo test (paso a paso)

1. Crear archivo en `src/test/java/...` con nombre `NombreControllerTest.java`.
2. Anotar con `@WebMvcTest(MiController.class)` si solo probás el controller.
3. Si el controller depende de servicios, mockealos con `@MockBean`.
4. Usar `mockMvc.perform(...)` y aserciones con `andExpect(...)`.

Ejemplo rápido:

```java
@WebMvcTest(MiController.class)
class MiControllerTest {

  @Autowired
  MockMvc mockMvc;

  @MockBean
  MiServicio miServicio; // si el controller lo inyecta

  @Test
  void ejemplo() throws Exception {
    when(miServicio.algo()).thenReturn(...);
    mockMvc.perform(post("/ruta").contentType("application/json").content("{...}"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.campo").exists());
  }
}
```

## Simular fallo del modelo (test de error)

Si querís probar que el controller traduce el error del modelo a 503, mockea el servicio para que lance la excepción que tu `GlobalExceptionHandler` captura. Por ejemplo:

```java
when(sentimentService.predict(any()))
  .thenThrow(new ModelUnavailableException("no anda"));

mockMvc.perform(post("/sentiment").contentType("application/json").content("{...}"))
  .andExpect(status().isServiceUnavailable())
  .andExpect(jsonPath("$.error").value("Modelo no disponible"));
```

## Logs y depuración

- Los logs de pruebas aparecen en la consola. MockMvc imprime la petición y la respuesta (útil para ajustar jsonPath).
- Si necesitás el output completo de Surefire, revisá `target/surefire-reports`.

## Buenas prácticas

- Mantener los nombres de campo del API consistentes (español o inglés). Si cambian, actualizá tests.
- Tests rápidos (MockMvc) para validar controller-level.
- Tests de integración (`@SpringBootTest`) para validar wiring y config.


