$dirs = Get-ChildItem -Recurse -Force -Directory -Filter ".git"
foreach ($dir in $dirs) {
    if ($dir.FullName -ne (Join-Path (Get-Location) ".git")) {
        Write-Host "Removing nested git: $($dir.FullName)"
        Remove-Item -Recurse -Force $dir.FullName
    }
}
