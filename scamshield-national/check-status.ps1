# One-glance diagnosis. Run this FIRST whenever the site looks broken,
# instead of guessing what to restart — it checks every layer keep-running.ps1
# depends on (Docker daemon, Postgres, backend, frontend) and the scheduled
# tasks that are supposed to be keeping them up, and prints a plain-English
# reason for anything that isn't healthy.
#
# Double-click check-status.bat, or run: powershell -File check-status.ps1

$root = $PSScriptRoot
$ok = { param($s) Write-Host "  [OK] $s" -ForegroundColor Green }
$bad = { param($s) Write-Host "  [!!] $s" -ForegroundColor Red }
$info = { param($s) Write-Host "      $s" -ForegroundColor DarkGray }

Write-Host ''
Write-Host '=== ScamShield National - status check ===' -ForegroundColor Cyan
Write-Host ''

# --- Docker ---
Write-Host 'Docker:'
try {
    docker info *> $null
    if ($LASTEXITCODE -eq 0) { & $ok 'Docker daemon is running' }
    else { & $bad 'Docker Desktop is open but the daemon is not responding (still starting up, or stuck)' }
} catch {
    & $bad 'Docker command not found, or Docker Desktop is not running at all'
    & $info 'Open Docker Desktop by hand and wait for it to say "Running", then re-run this check.'
}

# --- Postgres / Redis containers ---
Write-Host ''
Write-Host 'Containers:'
try {
    $ps = docker compose -f (Join-Path $root 'docker-compose.yml') ps --format json 2>$null
    if ($ps) {
        $rows = $ps -split "`n" | Where-Object { $_.Trim() } | ForEach-Object { $_ | ConvertFrom-Json }
        foreach ($row in $rows) {
            if ($row.State -eq 'running') { & $ok "$($row.Service): $($row.State)" }
            else { & $bad "$($row.Service): $($row.State)" }
        }
        if (-not $rows) { & $bad 'No containers found - run: docker compose up -d' }
    } else {
        & $bad 'Could not list containers (Docker daemon may be down - see above)'
    }
} catch {
    & $bad 'Could not list containers (Docker daemon may be down - see above)'
}

# --- Backend ---
Write-Host ''
Write-Host 'Backend (port 3000):'
$listening3000 = $false
try { $listening3000 = [bool](Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction Stop) } catch { }
if ($listening3000) {
    try {
        $resp = Invoke-WebRequest -Uri 'http://localhost:3000/health' -UseBasicParsing -TimeoutSec 5
        $body = $resp.Content | ConvertFrom-Json
        if ($body.status -eq 'ok') {
            & $ok 'Listening, and /health confirms the database is reachable'
        } else {
            & $bad "Listening, but the database is NOT reachable: $($body.error)"
            & $info 'Almost always a mismatch between backend/.env DATABASE_URL and docker-compose.yml credentials.'
            & $info 'Check backend/.env against backend/.env.example.'
        }
    } catch {
        & $bad "Listening, but /health did not respond: $($_.Exception.Message)"
    }
} else {
    & $bad 'Nothing listening on :3000'
    & $info 'See backend\backend-run-log.txt for why it is not running.'
}

# --- Frontend ---
Write-Host ''
Write-Host 'Frontend (port 5173):'
try {
    if (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction Stop) { & $ok 'Listening' }
} catch {
    & $bad 'Nothing listening on :5173'
    & $info 'See frontend\frontend-run-log.txt for why it is not running.'
}

# --- Scheduled tasks ---
Write-Host ''
Write-Host 'Scheduled tasks:'
foreach ($name in @('ScamShield National Auto-Update', 'ScamShield National Keep Running')) {
    try {
        $t = schtasks /query /tn $name /fo LIST /v 2>$null
        if ($LASTEXITCODE -eq 0) {
            $lastResult = ($t | Select-String 'Last Result:').ToString().Split(':')[1].Trim()
            $lastRun = ($t | Select-String 'Last Run Time:').ToString().Split(':', 2)[1].Trim()
            if ($lastResult -eq '0') { & $ok "$name - last ran $lastRun, succeeded" }
            else { & $bad "$name - last ran $lastRun, result code $lastResult (nonzero = failed)" }
        } else {
            & $bad "$name - not registered. Run setup-auto-updates.bat."
        }
    } catch {
        & $bad "$name - could not query (see above)"
    }
}

Write-Host ''
Write-Host '=== done ===' -ForegroundColor Cyan
Write-Host ''
Read-Host 'Press Enter to close'
