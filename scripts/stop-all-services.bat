@echo off
echo ============================================
echo        FARMIO SERVICES STOPPER
echo ============================================
echo.

echo This will stop all Java processes running Spring Boot applications.
echo.
echo WARNING: This will kill ALL Java processes on your system!
echo Make sure you don't have other important Java applications running.
echo.
echo Do you want to continue? (Y/N)
set /p choice=
if /i "%choice%" neq "Y" (
    echo Cancelled by user.
    exit /b 0
)

@REM Method 1
@REM echo.
@REM echo Stopping all Java/Spring Boot processes...

@REM REM Kill all Java processes (this will stop all Spring Boot services)
@REM taskkill /f /im java.exe /t >nul 2>&1
@REM taskkill /f /im javaw.exe /t >nul 2>&1

@REM echo.
@REM echo All Java processes have been terminated.
@REM echo.


@REM Method 2
echo .
echo Stopping ALL Farmio backend microservices...
echo.
setlocal enabledelayedexpansion
set ports=8761 8080 8085 8081 8083 8086 8087 8088 8089 8090 8091 8092 8093 8094
for %%p in (!ports!) do (
    set found=0
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr ":%%p "') do (
        if !found! equ 0 (
            echo Stopping process on port %%p...
            set found=1
        )
        echo Stopping process on port %%p with PID %%i...
        taskkill /f /pid %%i >nul 2>&1
    )
    if !found! equ 0 (
        echo No process found running on port %%p.
    )
)
echo.
echo All backend services stopped.
echo.

echo If you want to stop services more selectively, you can:
echo 1. Close individual terminal windows
echo 2. Use Ctrl+C in each terminal
echo 3. Use Task Manager to end specific java.exe processes
echo.
pause
