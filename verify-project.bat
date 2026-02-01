@echo off
REM Verification Script for Windows - Verify project structure
REM Run this to verify all files are created

setlocal enabledelayedexpansion

echo.
echo ====================================================================
echo   TikTok OAuth Project - Verification Script
echo ====================================================================
echo.

set "missing=0"

REM Function to check file
goto :startChecks

:checkFile
set "file=%~1"
if exist "%file%" (
    echo [OK] %file%
    exit /b 0
) else (
    echo [MISSING] %file%
    set /a missing=missing+1
    exit /b 1
)

:checkDir
set "dir=%~1"
if exist "%dir%" (
    echo [OK] %dir%\
    exit /b 0
) else (
    echo [MISSING] %dir%\
    set /a missing=missing+1
    exit /b 1
)

:startChecks

echo Directory Structure:
call :checkDir "src"
call :checkDir "src\auth"
call :checkDir "src\api"
call :checkDir "src\components"
call :checkDir "src\pages"
call :checkDir "src\utils"
call :checkDir "src\styles"
call :checkDir "public"

echo.
echo Core Files:
call :checkFile "package.json"
call :checkFile "vite.config.js"
call :checkFile "index.html"
call :checkFile ".gitignore"
call :checkFile "README.md"
call :checkFile "DEPLOYMENT.md"
call :checkFile "QUICK_REFERENCE.md"
call :checkFile "IMPLEMENTATION.md"

echo.
echo Auth Files:
call :checkFile "src\auth\config.js"
call :checkFile "src\auth\oauth.js"

echo.
echo API Files:
call :checkFile "src\api\tiktokApi.js"

echo.
echo Component Files:
call :checkFile "src\components\AdCreationForm.jsx"

echo.
echo Page Files:
call :checkFile "src\pages\Dashboard.jsx"
call :checkFile "src\pages\OAuthCallback.jsx"

echo.
echo Utility Files:
call :checkFile "src\utils\validation.js"
call :checkFile "src\utils\musicValidation.js"

echo.
echo Style Files:
call :checkFile "src\styles\index.css"
call :checkFile "src\styles\Dashboard.css"
call :checkFile "src\styles\OAuthCallback.css"
call :checkFile "src\styles\AdCreationForm.css"

echo.
echo Root Component Files:
call :checkFile "src\App.jsx"
call :checkFile "src\main.jsx"

echo.
echo Public Files:
call :checkFile "public\terms.html"
call :checkFile "public\privacy.html"

echo.
echo ====================================================================
if %missing% equ 0 (
    echo   SUCCESS: All files are present! ✓
) else (
    echo   WARNING: %missing% file(s) are missing!
)
echo ====================================================================
echo.
echo Next steps:
echo   1. npm install
echo   2. npm run dev (to test locally)
echo   3. npm run build
echo   4. npm run deploy (to GitHub Pages)
echo.
echo For more info, see README.md or DEPLOYMENT.md
echo.
pause
