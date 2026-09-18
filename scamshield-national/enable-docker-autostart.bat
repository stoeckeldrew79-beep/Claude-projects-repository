@echo off
REM One-time fix for Docker Desktop not being running some nights: turns on
REM Docker's own "Start Docker Desktop when you sign in" setting directly,
REM so you never have to open Docker Desktop by hand again after a reboot.
REM
REM IMPORTANT: Quit Docker Desktop fully first (right-click its tray icon ->
REM Quit Docker Desktop) before running this. Safe to run more than once.

cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0enable-docker-autostart.ps1"
