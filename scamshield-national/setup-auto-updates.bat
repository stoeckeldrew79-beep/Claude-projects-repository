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
echo Registering the start-at-logon trigger...
schtasks /create /tn "ScamShield National Start On Logon" /tr "\"%~dp0keep-running.vbs\"" /sc onlogon /rl limited /f
if errorlevel 1 goto failed

echo.
echo ============================================
echo  Done. Current status of all three:
echo ============================================
echo.
echo --- Content updater ---
schtasks /query /tn "ScamShield National Auto-Update" /fo LIST | findstr /C:"Status" /C:"Last Run Time" /C:"Last Result" /C:"Next Run Time"
echo.
echo --- Site keep-alive ---
schtasks /query /tn "ScamShield National Keep Running" /fo LIST | findstr /C:"Status" /C:"Last Run Time" /C:"Last Result" /C:"Next Run Time"
echo.
echo --- Start at logon ---
schtasks /query /tn "ScamShield National Start On Logon" /fo LIST | findstr /C:"Status" /C:"Last Run Time" /C:"Last Result" /C:"Next Run Time"

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
