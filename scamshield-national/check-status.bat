@echo off
REM Double-click this any time the site looks broken. It checks Docker, the
REM database, the backend, the frontend, and the two scheduled tasks that are
REM supposed to keep everything running, and tells you in plain English what
REM (if anything) is actually wrong - instead of guessing what to restart.

cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0check-status.ps1"
