$services = @(
    "analytic-service",
    "chat-service",
    "config-server",
    "crop-listing-service", 
    "order-service",
    "payment-service",
    "test-service",
    "transport-service",
    "warehouse-service",
    "waste-service"
)

foreach ($service in $services) {
    $filePath = "$PSScriptRoot\$service\src\main\resources\application.yml"
    
    if (Test-Path $filePath) {
        Write-Host "Processing $service..."
        
        # Read the file content
        $content = Get-Content -Path $filePath -Raw
        
        # Check if the file already has profiles
        if (-not ($content -match "profiles:\s+active:")) {
            # Extract port from the file
            if ($content -match "server:\s+port:\s+(\d+)") {
                $port = $matches[1]
            } else {
                $port = "8080" # Default port if not found
            }
            
            # Extract service name
            if ($content -match "application:\s+name:\s+(.+)") {
                $serviceName = $matches[1].Trim()
            } else {
                $serviceName = $service
            }
            
            # Create new content with profiles
            $newContent = @"
server:
  port: $port

spring:
  application:
    name: $serviceName
  profiles:
    active: local # Change to 'docker' when running in Docker
  cloud:
    config:
      import-check:
        enabled: false

---
spring:
  config:
    activate:
      on-profile: docker
  rabbitmq:
    host: rabbitmq
    port: 5672

eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka

---
spring:
  config:
    activate:
      on-profile: local
  rabbitmq:
    host: localhost
    port: 5672

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka
"@

            # Write the new content to the file
            Set-Content -Path $filePath -Value $newContent
            Write-Host "Updated $service configuration."
        } else {
            Write-Host "Skipping $service as it already has profiles configuration."
        }
    } else {
        Write-Host "File not found: $filePath"
    }
}

Write-Host "All services updated successfully!"
