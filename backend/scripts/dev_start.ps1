[CmdletBinding()]
param(
    [switch]$Reload
)

$ErrorActionPreference = "Stop"

# Determine repository root (two levels up from backend/scripts)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Split-Path -Parent $ScriptDir
$RepoRoot = Split-Path -Parent $BackendDir

Set-Location $RepoRoot

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " TerraLedger AI Backend Development Starter" -ForegroundColor Cyan
Write-Host " Working directory: $RepoRoot" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Activate .venv if present
$VenvActivate = Join-Path $RepoRoot ".venv\Scripts\Activate.ps1"
$VenvPython = Join-Path $RepoRoot ".venv\Scripts\python.exe"

if (Test-Path $VenvActivate) {
    Write-Host "[*] Activating virtual environment (.venv)..." -ForegroundColor Green
    & $VenvActivate
} elseif (Test-Path $VenvPython) {
    Write-Host "[*] Found .venv python at $VenvPython" -ForegroundColor Green
} else {
    Write-Warning "[!] .venv not found; falling back to system Python."
    $VenvPython = "python"
}

# 2. Free port 8000 by terminating any occupying process tree
$Port = 8000
$Connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

if ($Connections) {
    $ProcessIds = $Connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pidToKill in $ProcessIds) {
        if ($pidToKill -gt 0) {
            $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $pidToKill" -ErrorAction SilentlyContinue
            $procName = if ($proc) { $proc.Name } else { "Unknown" }
            $procCmd = if ($proc) { $proc.CommandLine } else { "N/A" }
            Write-Host "[!] Port $Port is currently occupied by PID $pidToKill ($procName)." -ForegroundColor Yellow
            Write-Host "    CommandLine: $procCmd" -ForegroundColor DarkGray
            Write-Host "[*] Killing process tree for PID $pidToKill (taskkill /PID $pidToKill /T /F)..." -ForegroundColor Yellow
            taskkill /PID $pidToKill /T /F
        }
    }
    Start-Sleep -Milliseconds 800
} else {
    Write-Host "[*] Port $Port is free." -ForegroundColor Green
}

# 3. Launch uvicorn from repository root
$UvicornArgs = @("-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000")
if ($Reload) {
    Write-Host "[*] Starting uvicorn with --reload enabled..." -ForegroundColor Cyan
    $UvicornArgs += "--reload"
} else {
    Write-Host "[*] Starting uvicorn..." -ForegroundColor Cyan
}

Write-Host "[*] Executing: $VenvPython $($UvicornArgs -join ' ')" -ForegroundColor DarkGray
& $VenvPython $UvicornArgs
