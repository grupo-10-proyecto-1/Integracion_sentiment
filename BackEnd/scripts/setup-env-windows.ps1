<#
Script: setup-env-windows.ps1
Propósito: Establecer permanentemente JAVA_HOME (y opcionalmente MAVEN_HOME) a nivel Machine en Windows.
Uso: Ejecutar con privilegios de Administrador.
Ejemplo: powershell -ExecutionPolicy Bypass -File .\scripts\setup-env-windows.ps1 -JavaHome "C:\Program Files\Java\jdk-21"
Opcional: pasar -MavenHome "C:\path\to\apache-maven-3.x" si deseas definir MAVEN_HOME.
#>
param(
    [string]$JavaHome = "C:\Program Files\Java\jdk-17",
    [string]$MavenHome = ""
)

function Test-RunAsAdmin {
    $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-not $isAdmin) {
        Write-Output "No se detectaron privilegios de administrador. Se relanzará el script solicitando elevación..."
        $argList = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`" -JavaHome `"$JavaHome`" -MavenHome `"$MavenHome`""
        Start-Process -FilePath "powershell.exe" -ArgumentList $argList -Verb RunAs
        exit
    }
}

Test-RunAsAdmin

Write-Output "Estableciendo JAVA_HOME en '$JavaHome' (Machine)..."
[Environment]::SetEnvironmentVariable("JAVA_HOME", $JavaHome, "Machine")

$javaBin = Join-Path $JavaHome "bin"
$machinePath = [Environment]::GetEnvironmentVariable("Path","Machine")
if ($machinePath -notlike "*$javaBin*") {
    Write-Output "Añadiendo '$javaBin' al Path (Machine)..."
    [Environment]::SetEnvironmentVariable("Path", $machinePath + ";" + $javaBin, "Machine")
} else {
    Write-Output "Path ya contiene '$javaBin'."
}

if ($MavenHome -and $MavenHome -ne "") {
    Write-Output "Estableciendo MAVEN_HOME en '$MavenHome' (Machine)..."
    [Environment]::SetEnvironmentVariable("MAVEN_HOME", $MavenHome, "Machine")
    $mavenBin = Join-Path $MavenHome "bin"
    $machinePath = [Environment]::GetEnvironmentVariable("Path","Machine")
    if ($machinePath -notlike "*$mavenBin*") {
        Write-Output "Añadiendo '$mavenBin' al Path (Machine)..."
        [Environment]::SetEnvironmentVariable("Path", $machinePath + ";" + $mavenBin, "Machine")
    } else {
        Write-Output "Path ya contiene '$mavenBin'."
    }
}

Write-Output "Listo. Abre una nueva sesión PowerShell (o reinicia la sesión) para que los cambios se apliquen."
