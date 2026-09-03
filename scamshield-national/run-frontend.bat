@echo off
REM Starts the frontend dev server. You usually don't need this — the
REM frontend auto-refreshes on its own once it's running, so leave that
REM window alone. Only run this if you accidentally closed the frontend
REM window and the site stops loading in the browser.
REM
REM Leave this window open once you see "Local: http://localhost:5173/" -
REM don't click into it again until you need to stop it.

cd /d "%~dp0\frontend"
call npm run dev
