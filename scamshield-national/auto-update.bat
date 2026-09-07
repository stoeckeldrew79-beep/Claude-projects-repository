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

git fetch origin main >> auto-update-log.txt 2>&1
if errorlevel 1 (
  echo [%date% %time%] git fetch failed >> auto-update-log.txt
  exit /b 1
)

git checkout -B main origin/main >> auto-update-log.txt 2>&1
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

REM State Attorney General alerts - what fills the "Latest alerts" box on
REM each state page. Unlike the jobs above this one is expensive: 51 states,
REM each with a news search and, for the 18 that publish one, their own feed
REM - about 70 external requests, measured at several minutes end to end
REM (it runs quietly in the background, so this costs you nothing). The sources
REM publish daily at most, so running it on this script's 30-minute cycle
REM would make several thousand pointless requests a day and risk being
REM rate-limited. The marker file below holds it to roughly every 6 hours,
REM which keeps it in this one scheduled task instead of needing a second.
set "MARKER=..\state-ag-last-run.txt"
powershell -NoProfile -Command "if ((Test-Path '%MARKER%') -and (((Get-Date) - (Get-Item '%MARKER%').LastWriteTime).TotalHours -lt 6)) { exit 1 }"
if errorlevel 1 goto skip_state_ag

call npm run scan-state-ag-news >> ..\auto-update-log.txt 2>&1
if errorlevel 1 goto state_ag_failed

REM Stamped only on success, so a failed scan retries on the next 30-minute
REM run instead of waiting out the full 6 hours.
echo scan-state-ag-news last completed here > "%MARKER%"
echo [%date% %time%] scan-state-ag-news completed >> ..\auto-update-log.txt
goto after_state_ag

:state_ag_failed
echo [%date% %time%] scan-state-ag-news failed - non-fatal, continuing >> ..\auto-update-log.txt
goto after_state_ag

:skip_state_ag
echo [%date% %time%] scan-state-ag-news skipped - ran within the last 6 hours >> ..\auto-update-log.txt

:after_state_ag

echo [%date% %time%] Auto-update completed successfully >> ..\auto-update-log.txt
