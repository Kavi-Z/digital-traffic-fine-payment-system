@echo off
REM Create Flutter mobile app directory structure

setlocal enabledelayedexpansion

set BASEPATH=f:\semester 06\EC6208-Software Architcture(TE)\project\digital-traffic-fine-payment-system\mobile_app

REM Create all directories
mkdir "%BASEPATH%\lib\theme"
mkdir "%BASEPATH%\lib\models"
mkdir "%BASEPATH%\lib\services"
mkdir "%BASEPATH%\lib\providers"
mkdir "%BASEPATH%\lib\router"
mkdir "%BASEPATH%\lib\screens\auth"
mkdir "%BASEPATH%\lib\screens\home"
mkdir "%BASEPATH%\lib\screens\payment"
mkdir "%BASEPATH%\lib\widgets"
mkdir "%BASEPATH%\assets\images"
mkdir "%BASEPATH%\assets\fonts"
mkdir "%BASEPATH%\android"
mkdir "%BASEPATH%\ios"
mkdir "%BASEPATH%\web"

echo.
echo ✓ All directories created successfully!
echo.
echo Directory structure created at: %BASEPATH%
echo.

endlocal
