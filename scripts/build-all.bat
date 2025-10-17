REM ===============================
REM Farmio Build All Services Script
REM ===============================

REM List of services to build
set services=eureka-server api-gateway auth-service order-service crop-listing-service waste-service transport-service warehouse-service analytic-service chat-service payment-service

REM Banner
cls
echo ============================================
echo     Building all Farmio microservices...
echo ============================================
echo.

REM Check network connectivity
echo Checking network connectivity...
ping -n 1 repo.maven.apache.org >nul 2>&1
if errorlevel 1 (
    echo Network connectivity issue detected!
    echo Suggestions:
    echo    1. Check your internet connection
    echo    2. Check if you're behind a corporate firewall
    echo    3. Try: mvn clean install -o ^(offline mode^)
    echo    4. Or configure proxy in ~/.m2/settings.xml
    pause
    exit /b 
) else (
    echo Network connectivity OK
)

echo.
REM Build each service
for %%s in (%services%) do (
    if exist "%~dp0..\backend\%%s" (
        echo Building %%s in a new Windows Terminal tab...
        wt -w 0 nt -d "%~dp0..\backend\%%s" cmd /k "echo Building %%s... && mvn clean package -DskipTests"
    ) else (
        echo Directory %%s not found, skipping...
    )
)

echo.
:end
REM Return to the original starting directory
set ORIGINAL_DIR=%cd%
cd /d %~dp0
cd /d "%ORIGINAL_DIR%"

echo ============================================
echo 🎉 Build summary:
for %%s in (%services%) do (
    if exist "%~dp0..\backend\%%s\target\*.jar" (
        echo    %%s
    ) else (
        echo    %%s (JAR not found)
    )
)
echo ============================================
echo.
echo Next steps:
echo    1. Start services: docker-compose -f docker-compose.runtime.yml --profile essential up
echo    2. View logs:    docker-compose -f docker-compose.runtime.yml logs -f
echo    3. Stop services: docker-compose -f docker-compose.runtime.yml down
endlocal
