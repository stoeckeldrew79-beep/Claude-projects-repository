@echo off
REM One-time setup. Double-click this ONCE and ScamShield National will
REM silently check GitHub for new content every 30 minutes forever after
REM that, completely in the background - no windows, no clicking, nothing
REM to remember. Safe to double-click again later; it just re-registers
REM the same schedule.
REM
REM This only works while your computer is on and you're logged in (no
REM password is stored, so it can't run while fully signed out).

cd /d "%~dp0"

schtasks /create /tn "ScamShield National Auto-Update" /tr "\"%~dp0auto-update-silent.vbs\"" /sc minute /mo 30 /rl limited /f

if errorlevel 1 (
  echo.
  echo Something went wrong setting up the automatic schedule - see the
  echo error above. Send Claude a screenshot of this window.
  pause
  exit /b 1
)

echo.
echo ============================================
echo  Done! ScamShield National will now silently
echo  check for updates every 30 minutes, for as
echo  long as your computer is on and you're
echo  logged in. You never need to run this again.
echo ============================================
pause
