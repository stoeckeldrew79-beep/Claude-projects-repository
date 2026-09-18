# One-time fix for the actual root cause of "Docker isn't running" every
# night: Docker Desktop is a normal Windows app, so a reboot or shutdown
# closes it like anything else, and nothing brings it back unless its own
# "Start Docker Desktop when you sign in" setting is turned on. This script
# turns that setting on directly in Docker's own settings file, so it's a
# one-time fix instead of a click-through-Settings-every-time fix.
#
# IMPORTANT: Quit Docker Desktop fully first (right-click its tray icon ->
# Quit Docker Desktop) before running this - it only reads this file back in
# on its next launch, and a running copy can overwrite your change on exit.
#
# Safe: makes a timestamped backup of the settings file before touching it,
# and only ever changes the one autostart key - everything else in the file
# is preserved exactly as-is.

$candidates = @(
    (Join-Path $env:APPDATA 'Docker\settings-store.json'),  # Docker Desktop 4.35+
    (Join-Path $env:APPDATA 'Docker\settings.json')         # Docker Desktop 4.34 and earlier
)
$settingsFile = $candidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $settingsFile) {
    Write-Host "Could not find Docker's settings file at either:" -ForegroundColor Red
    $candidates | ForEach-Object { Write-Host "  $_" }
    Write-Host ''
    Write-Host 'Docker Desktop may not be installed, or stores settings somewhere nonstandard on this machine.'
    Write-Host 'Fall back to the manual route: open Docker Desktop -> gear icon -> General -> check' -ForegroundColor Yellow
    Write-Host '"Start Docker Desktop when you sign in to your computer".' -ForegroundColor Yellow
    Read-Host 'Press Enter to close'
    exit 1
}

Write-Host "Found Docker's settings file: $settingsFile"

$backup = "$settingsFile.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item -LiteralPath $settingsFile -Destination $backup
Write-Host "Backed up to: $backup"

$json = Get-Content -LiteralPath $settingsFile -Raw | ConvertFrom-Json

# Docker Desktop has used different casing for this key across versions -
# check every spelling that has actually shipped rather than guessing one.
$keyNames = @('autoStart', 'AutoStart', 'StartAtLogin')
$found = $null
foreach ($k in $keyNames) {
    if ($json.PSObject.Properties.Name -contains $k) { $found = $k; break }
}

if ($found) {
    $json.$found = $true
    Write-Host "Set existing '$found' key to true."
} else {
    # Not present at all in this version's file - add the modern key name.
    $json | Add-Member -MemberType NoteProperty -Name 'autoStart' -Value $true -Force
    Write-Host "No existing autostart key found - added 'autoStart: true'."
}

$json | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $settingsFile -Encoding UTF8

Write-Host ''
Write-Host 'Done. Docker Desktop will now start automatically the next time you sign in to Windows.' -ForegroundColor Green
Write-Host 'Open Docker Desktop now (or restart it if it was already open) for this to take effect immediately too.'
Read-Host 'Press Enter to close'
