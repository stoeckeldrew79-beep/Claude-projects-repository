@echo off
REM One-click update: pulls the latest code, applies any new database
REM migrations, reseeds, then starts the backend server. Double-click this
REM file (or run it from a terminal) instead of typing git pull / npm run
REM migrate / npm run seed / npm run dev separately.
REM
REM Leave this window open once you see "ScamShield National API listening
REM on :3000" — don't click into it again until you need to stop it (that
REM avoids the terminal freeze-on-click issue). To get new updates later,
REM close this window and double-click this file again.

cd /d "%~dp0"

echo ============================================
echo  Pulling latest code from GitHub...
echo ============================================
git pull
if errorlevel 1 (
  echo.
  echo git pull failed - see the error above. Not continuing.
  pause
  exit /b 1
)

cd backend

echo.
echo ============================================
echo  Applying any new database migrations...
echo ============================================
call npm run migrate
if errorlevel 1 (
  echo.
  echo Migration failed - see the error above. Not continuing.
  pause
  exit /b 1
)

echo.
echo ============================================
echo  Reseeding the database with latest content...
echo ============================================
call npm run seed
if errorlevel 1 (
  echo.
  echo Seed failed - see the error above. Not continuing.
  pause
  exit /b 1
)

echo.
echo ============================================
echo  Starting the backend server...
echo  (leave this window open - don't click into it)
echo ============================================
call npm run dev
