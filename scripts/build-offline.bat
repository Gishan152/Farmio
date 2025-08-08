@echo off
setlocal enabledelayedexpansion

echo 🚀 Building Farmio services (Offline Mode)...
echo ⚠️  This requires dependencies to be already cached in ~/.m2

set services=eureka-server api-gateway auth-service order-service crop-listing-service waste-service transport-service warehouse-service analytic-service chat-service payment-service

if exist pom.xml (
    echo 📦 Building parent POM (offline)...
    mvn clean install -N -DskipTests -o
    if !errorlevel! neq 0 (
        echo ❌ Parent POM build failed!
        echo 💡 Dependencies may not be cached. Try online build first.
        pause
        exit /b 1
    )
)

for %%s in (%services%) do (
    if exist "%%s" (
        echo 🔨 Building %%s (offline)...
        cd "%%s"
        mvn clean package -DskipTests -o -q
        if !errorlevel! equ 0 (
            echo ✅ %%s built successfully
        ) else (
            echo ❌ Failed to build %%s (offline)
            echo 💡 Dependencies may not be cached for this service
            cd ..
            pause
            exit /b 1
        )
        cd ..
    ) else (
        echo ⚠️  Directory %%s not found, skipping...
    )
)

echo 🎉 All services built successfully (offline)!
echo 🐳 You can now run: docker-compose -f docker-compose.runtime.yml --profile essential up
