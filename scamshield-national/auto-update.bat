@echo off
REM Silently pulls the latest code and refreshes the database. There is no
REM need to restart anything after this runs: the backend and frontend dev
REM servers both watch their own source files and auto-restart/auto-reload
REM on change, and new scam/article content goes straight into the live
REM database via "npm run seed" - the running API reads it immediately on
REM the next request, with no restart required.
REM
REM This is meant to run automatically in the background (see
REM setup-auto-updates.bat) - you should never need to double-click this
REM file yourself. Each run appends one block to auto-update-log.txt so
REM you can check what happened if something seems off.

cd /d "%~dp0"

echo [%date% %time%] Starting auto-update >> auto-update-log.txt

git fetch origin claude/scamshield-national-phase1 >> auto-update-log.txt 2>&1
if errorlevel 1 (
  echo [%date% %time%] git fetch failed >> auto-update-log.txt
  exit /b 1
)

git checkout -B claude/scamshield-national-phase1 origin/claude/scamshield-national-phase1 >> auto-update-log.txt 2>&1
if errorlevel 1 (
  echo [%date% %time%] git checkout failed >> auto-update-log.txt
  exit /b 1
)

cd backend

call npm run migrate >> ..\auto-update-log.txt 2>&1
if errorlevel 1 (
  echo [%date% %time%] migrate failed >> ..\auto-update-log.txt
  exit /b 1
)

call npm run seed >> ..\auto-update-log.txt 2>&1
if errorlevel 1 (
  echo [%date% %time%] seed failed >> ..\auto-update-log.txt
  exit /b 1
)

call npm run scan-daily-news >> ..\auto-update-log.txt 2>&1
if errorlevel 1 (
  echo [%date% %time%] scan-daily-news failed - non-fatal, continuing >> ..\auto-update-log.txt
)

echo [%date% %time%] Auto-update completed successfully >> ..\auto-update-log.txt
