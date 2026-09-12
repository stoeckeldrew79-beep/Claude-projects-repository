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
# Safe to run at any time: it starts only what is not already listening, so
# running it twice never leaves two copies of a server.

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

function Start-Hidden([string]$workingDir, [string]$command) {
    # No -Wait: these servers must outlive this script. Hidden so nothing
    # flashes on screen every five minutes.
    $opts = @{
        FilePath         = 'cmd.exe'
        ArgumentList     = "/c $command"
        WorkingDirectory = $workingDir
        WindowStyle      = 'Hidden'
        ErrorAction      = 'SilentlyContinue'
    }
    Start-Process @opts
}

# Postgres and Redis run in Docker. "up -d" is idempotent - it starts them if
# they are down and does nothing if they are already up. Best effort: right
# after a reboot Docker Desktop may not be ready, and the next run picks it up.
Start-Hidden $root 'docker compose up -d'

if (Test-Listening 3000) {
    Write-Log 'backend already running'
} else {
    Write-Log 'backend not listening - starting it'
    Start-Hidden (Join-Path $root 'backend') 'npm run dev'
}

if (Test-Listening 5173) {
    Write-Log 'frontend already running'
} else {
    Write-Log 'frontend not listening - starting it'
    Start-Hidden (Join-Path $root 'frontend') 'npm run dev'
}
