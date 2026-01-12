# Configuración de entorno (Windows)

Este documento describe cómo establecer variables de entorno permanentes para los desarrolladores Windows del proyecto.

## Script incluido
Se proporciona el script `scripts/setup-env-windows.ps1` que establece `JAVA_HOME` a nivel máquina y, opcionalmente, `MAVEN_HOME` y sus entradas en `Path`.

### Uso (desde PowerShell)
Abrir PowerShell como Administrador y ejecutar:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-env-windows.ps1 -JavaHome "C:\Program Files\Java\jdk-21"
```

Si quieres establecer `MAVEN_HOME` (opcional):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-env-windows.ps1 -JavaHome "C:\Program Files\Java\jdk-21" -MavenHome "C:\tools\apache-maven-3.9.6"
```

### Notas
- El script intentará relanzarse con privilegios de administrador si no se ejecuta con ellos.
- Los cambios son a nivel `Machine` y requieren abrir una nueva sesión (o reiniciar) para que sean visibles.
- Usar `mvnw` (Maven Wrapper) es preferible para evitar depender de una instalación global de Maven; `MAVEN_HOME` no es estrictamente necesario si usas el wrapper.