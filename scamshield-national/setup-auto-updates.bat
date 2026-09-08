@echo off
REM One-time setup. Double-click this ONCE and ScamShield National looks
REM after itself from then on:
REM
REM   * every 30 minutes - pulls new content from GitHub and loads it into
REM     the database, so the site shows new scams without you doing anything
REM   * every 5 minutes  - checks the site is actually up and restarts
REM     anything that isn't, so a reboot, a crash, or a closed window can't
REM     leave the site down
REM
REM Both run silently in the background. No windows, nothing to click.
REM
REM Safe to double-click again any time. It re-registers both schedules
REM pointing at THIS folder, which is also the fix if the site was ever set
REM up from a different copy of the repository: an already-registered task
REM keeps pointing wherever it was first created, so re-running this from
REM the folder you actually use is what corrects it.
REM
REM This only works while your computer is on and you're logged in (no
REM password is stored, so it can't run while fully signed out).

cd /d "%~dp0"

echo Registering the content updater (every 30 minutes)...
schtasks /create /tn "ScamShield National Auto-Update" /tr "\"%~dp0auto-update-silent.vbs\"" /sc minute /mo 30 /rl limited /f
if errorlevel 1 goto failed

echo.
echo Registering the site keep-alive (every 5 minutes)...
schtasks /create /tn "ScamShield National Keep Running" /tr "\"%~dp0keep-running.vbs\"" /sc minute /mo 5 /rl limited /f
if errorlevel 1 goto failed

echo.
echo Registering the start-at-logon trigger (optional)...
REM An ONLOGON task normally needs administrator rights, so this is the one
REM step allowed to fail. Scoping it to the current user with /ru lets it
REM succeed unelevated on some machines; where it doesn't, nothing is lost -
REM the 5-minute keep-alive above already brings the site back after a
REM reboot, just up to five minutes later. Never abort setup over it.
schtasks /create /tn "ScamShield National Start On Logon" /tr "\"%~dp0keep-running.vbs\"" /sc onlogon /ru "%USERNAME%" /rl limited /f
if errorlevel 1 (
  echo.
  echo   Skipped - Windows requires administrator rights for a logon trigger.
  echo   This is fine and nothing is broken: the 5-minute keep-alive already
  echo   restarts the site after a reboot, within five minutes of you
  echo   logging in. Only run this as administrator if you want it instant.
)

REM schtasks cannot express three settings that decide whether a task ever
REM actually runs, so they are applied afterwards. Without them a task can be
REM registered, enabled, and still never execute:
REM
REM   AllowStartIfOnBatteries    - schtasks defaults to REFUSING to start a
REM     DontStopIfGoingOnBatteries task on battery power. On a laptop that is
REM     silently fatal: the task fires, Windows refuses it, and the last
REM     result reads 0x800710E0, "the operator or administrator has refused
REM     the request". Nothing in the UI suggests the battery is the reason.
REM
REM   StartWhenAvailable         - a missed run (asleep, shut down) is
REM     otherwise dropped rather than caught up, so an overnight sleep can
REM     leave the schedule stalled until the next manual run.
REM
REM   ExecutionTimeLimit         - a run that somehow hangs would otherwise
REM     block every later run for the 72-hour default.
echo.
echo Applying power and catch-up settings...
powershell -NoProfile -Command "$s = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 1); Set-ScheduledTask -TaskName 'ScamShield National Auto-Update' -Settings $s | Out-Null"
powershell -NoProfile -Command "$s = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 10); Set-ScheduledTask -TaskName 'ScamShield National Keep Running' -Settings $s | Out-Null"

echo.
echo ============================================
echo  Done. Current status of all three:
echo ============================================
echo.
echo --- Content updater ---
schtasks /query /tn "ScamShield National Auto-Update" /fo LIST /v | findstr /C:"Status" /C:"Last Run Time" /C:"Last Result" /C:"Next Run Time"
echo.
echo --- Site keep-alive ---
schtasks /query /tn "ScamShield National Keep Running" /fo LIST /v | findstr /C:"Status" /C:"Last Run Time" /C:"Last Result" /C:"Next Run Time"
echo.
echo --- Start at logon (optional) ---
schtasks /query /tn "ScamShield National Start On Logon" /fo LIST /v 2>nul | findstr /C:"Status" /C:"Last Run Time" /C:"Last Result" /C:"Next Run Time"
if errorlevel 1 echo   Not registered - needs administrator rights. Not a problem; see above.

echo.
echo ============================================
echo  Set up against this folder:
echo  %~dp0
echo.
echo  The site now updates itself and restarts
echo  itself. You should never need to run git
echo  pull, or start the servers by hand, again.
echo.
echo  A "Last Result" of 0 means the last run
echo  succeeded. Anything else, send Claude a
echo  screenshot of this window.
echo ============================================
pause
exit /b 0

:failed
echo.
echo Something went wrong registering the schedule - see the error above.
echo Send Claude a screenshot of this window.
pause
exit /b 1
