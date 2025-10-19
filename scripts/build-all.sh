#!/bin/bash

set -e  # Exit on any error

echo "🚀 Building all Farmio services..."

# List of services to build
services=(
    "eureka-server"
    "api-gateway" 
    "auth-service"
    "order-service"
    "crop-listing-service"
    "waste-service"
    "transport-service"
    "warehouse-service"
    "analytic-service"
    "chat-service"
    "payment-service"
    "notification-service"
)

# Build parent pom first if it exists
if [ -f "pom.xml" ]; then
    echo "📦 Building parent POM..."
    mvn clean install -N -DskipTests
fi

# Build each service
for service in "${services[@]}"; do
    if [ -d "$service" ]; then
        echo "🔨 Building $service..."
        cd "$service"
        mvn clean package -DskipTests -q
        if [ $? -eq 0 ]; then
            echo "✅ $service built successfully"
        else
            echo "❌ Failed to build $service"
            exit 1
        fi
        cd ..
    else
        echo "⚠️  Directory $service not found, skipping..."
    fi
done

echo "🎉 All services built successfully!"
echo "🐳 You can now run: docker-compose -f docker-compose.runtime.yml --profile essential up"
