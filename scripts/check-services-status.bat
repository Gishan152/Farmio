@echo off
set ORIGINAL_DIR=%cd%
echo ============================================
echo       FARMIO SERVICES STATUS CHECKER
echo ============================================
echo.

echo Checking service status...
echo.

REM Function to check if a port is listening
setlocal enabledelayedexpansion

echo Service Status:
echo ----------------------------------------

REM Check each service port
set services[0]=Eureka Server:8761
set services[1]=API Gateway:8080
set services[2]=Product Service:8081
set services[3]=Test Service:8083
set services[4]=Auth Service:8085
set services[5]=Order Service:8086
set services[6]=Crop Listing:8087
set services[7]=Waste Service:8088
set services[8]=Transport Service:8089
set services[9]=Warehouse Service:8090
set services[10]=Analytics Service:8091
set services[11]=Chat Service:8092
set services[12]=Payment Service:8093

for /L %%i in (0,1,12) do (
    for /f "tokens=1,2 delims=:" %%a in ("!services[%%i]!") do (
        netstat -an | find "LISTENING" | find ":%%b " >nul
        if !errorlevel! equ 0 (
            echo [✓] %%a ^(Port %%b^) - RUNNING
        ) else (
            echo [✗] %%a ^(Port %%b^) - STOPPED
        )
    )
)

echo.
echo ----------------------------------------
echo Additional Checks:
echo ----------------------------------------

REM Check RabbitMQ
netstat -an | find "LISTENING" | find ":5672 " >nul
if %errorlevel% equ 0 (
    echo [✓] RabbitMQ ^(Port 5672^) - RUNNING
) else (
    echo [✗] RabbitMQ ^(Port 5672^) - STOPPED
)

REM Check PostgreSQL
netstat -an | find "LISTENING" | find ":5432 " >nul
if %errorlevel% equ 0 (
    echo [✓] PostgreSQL ^(Port 5432^) - RUNNING
) else (
    echo [✗] PostgreSQL ^(Port 5432^) - STOPPED
)

echo.
echo ----------------------------------------
echo Quick Links:
echo ----------------------------------------
echo - Eureka Dashboard: http://localhost:8761
echo - API Gateway: http://localhost:8080
echo - RabbitMQ Management: http://localhost:15672
echo ----------------------------------------
echo.
pause >nul
cd /d "%ORIGINAL_DIR%"
