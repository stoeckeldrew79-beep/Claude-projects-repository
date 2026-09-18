# Makes sure the site is actually up, and silently starts whatever isn't.
#
# auto-update.bat keeps the CONTENT fresh; this keeps the SITE ALIVE. Content
# syncing perfectly is worth nothing while the backend is stopped - the site
# then shows "This site can't be reached", indistinguishable from being broken.
#
# Runs every 5 minutes (see setup-auto-updates.bat), so the site comes back on
# its own after a reboot, a crash, or a window being closed.
#
# This was VBScript until Windows Script Host turned out to be blocked on the
# machine running the site: the scheduled task launched wscript, the process
# was killed immediately, and the task reported 0x8007042B (ERROR_PROCESS_
# ABORTED) while nothing whatsoever happened. PowerShell is what demonstrably
# runs there, so the logic lives here now. It also lets the port check use
# Get-NetTCPConnection instead of parsing netstat text.
#
# Safe to run at any time: it starts only what is not already healthy, so
# running it twice never leaves two copies of a server.
#
# --- What changed here and why (the recurring "stuck on Loading" nights) ---
# A port merely LISTENING was being treated as "the backend is fine", but the
# backend binds its port before it ever touches the database (the pg Pool
# connects lazily), so a live process on :3000 proved nothing about whether it
# could actually answer a request. If Postgres was unreachable — most often
# because Docker Desktop itself hadn't been launched yet, since `docker
# compose up -d` only talks to an ALREADY-RUNNING Docker engine and fails
# silently (discarded by Start-Hidden) if there isn't one — every real API
# call would 500, or the whole process could exit outright via the pool's
# `error` handler, and this script's only check (port 3000 listening) had no
# way to see any of that. It now checks Docker's daemon itself, waits for it,
# and checks the backend's real /health endpoint (which now does a live
# `SELECT 1`) instead of just the port. Every step also now logs its actual
# result instead of discarding it, so a failure leaves a trail instead of
# silently repeating forever.

$root = $PSScriptRoot
$log = Join-Path $root 'keep-running-log.txt'

function Write-Log([string]$message) {
    # Logging must never be the reason this script fails to start a server.
    try { '{0}  {1}' -f (Get-Date), $message | Add-Content -LiteralPath $log -ErrorAction Stop } catch { }
}

function Test-Listening([int]$port) {
    # Throws when nothing is listening, which is the answer, not an error.
    try { return [bool](Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction Stop) }
    catch { return $false }
}

function Test-DockerDaemonUp {
    # `docker info` only succeeds against a running daemon — this is what
    # `docker compose up -d` itself needs, so checking it directly (rather
    # than "is Docker Desktop.exe running", which can be true seconds before
    # the daemon inside it is actually ready) is what avoids racing it.
    try {
        docker info *> $null
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

function Start-DockerDesktop {
    $candidates = @(
        "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe",
        "${env:ProgramFiles(x86)}\Docker\Docker\Docker Desktop.exe"
    )
    $exe = $candidates | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -First 1
    if (-not $exe) {
        Write-Log 'Docker Desktop not found at either default install path - cannot auto-start it. Install Docker Desktop, or start it manually before the next run.'
        return $false
    }
    Write-Log "Docker daemon not up - launching Docker Desktop ($exe)"
    Start-Process -FilePath $exe -WindowStyle Hidden -ErrorAction SilentlyContinue
    return $true
}

function Wait-ForDockerDaemon([int]$timeoutSeconds = 90) {
    $deadline = (Get-Date).AddSeconds($timeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-DockerDaemonUp) { return $true }
        Start-Sleep -Seconds 5
    }
    return $false
}

function Start-Hidden([string]$workingDir, [string]$command, [string]$logFile) {
    # No -Wait: these servers must outlive this script. Hidden so nothing
    # flashes on screen every five minutes. Output now goes to a real log
    # file instead of being discarded, so a crash loop leaves evidence.
    $opts = @{
        FilePath               = 'cmd.exe'
        ArgumentList           = "/c $command >> `"$logFile`" 2>&1"
        WorkingDirectory       = $workingDir
        WindowStyle            = 'Hidden'
        ErrorAction            = 'SilentlyContinue'
    }
    Start-Process @opts
}

# --- Docker / Postgres / Redis ---
if (Test-DockerDaemonUp) {
    Write-Log 'Docker daemon already up'
} else {
    if (Start-DockerDesktop) {
        if (Wait-ForDockerDaemon) {
            Write-Log 'Docker daemon came up'
        } else {
            Write-Log 'Docker daemon still not up after waiting 90s - Postgres/Redis cannot start this run. Open Docker Desktop by hand and check it is not stuck on an update or a WSL error.'
        }
    }
}

if (Test-DockerDaemonUp) {
    $composeLog = Join-Path $root 'docker-compose-log.txt'
    Start-Hidden $root 'docker compose up -d' $composeLog
    Write-Log 'ran docker compose up -d (see docker-compose-log.txt for its output)'
} else {
    Write-Log 'skipped docker compose up -d - daemon is not up'
}

# --- Backend: checked by real health, not just "something is listening" ---
$backendHealthy = $false
if (Test-Listening 3000) {
    try {
        $resp = Invoke-WebRequest -Uri 'http://localhost:3000/health' -UseBasicParsing -TimeoutSec 5
        $body = $resp.Content | ConvertFrom-Json
        if ($body.status -eq 'ok') {
            $backendHealthy = $true
            Write-Log 'backend healthy (port listening, /health reports database connected)'
        } else {
            Write-Log "backend port is listening but /health reports degraded: $($resp.Content) - restarting it"
        }
    } catch {
        Write-Log "backend port is listening but /health did not respond cleanly ($($_.Exception.Message)) - restarting it"
    }
} else {
    Write-Log 'backend not listening - starting it'
}

if (-not $backendHealthy) {
    # A stuck-but-listening process needs to actually be killed before a
    # fresh one is started, or the new process fails to bind :3000 at all.
    try {
        Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
            ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    } catch { }
    $backendLog = Join-Path $root 'backend\backend-run-log.txt'
    Start-Hidden (Join-Path $root 'backend') 'npm run dev' $backendLog
}

# --- Frontend ---
if (Test-Listening 5173) {
    Write-Log 'frontend already running'
} else {
    Write-Log 'frontend not listening - starting it'
    $frontendLog = Join-Path $root 'frontend\frontend-run-log.txt'
    Start-Hidden (Join-Path $root 'frontend') 'npm run dev' $frontendLog
}
