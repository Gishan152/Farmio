# Secure Service-to-Service Communication for Order State Updates

## Problem
You want to allow the `payment-service` to update the payment state of an order (e.g., from `PENDING` to `PROCESSING`) in the `order-service`. This must be done securely so that only the `payment-service` can perform this action, and not end users or other unauthorized services.

## Solution Overview
The recommended approach is to use **JWT-based service-to-service authentication**. This ensures that only trusted services can access sensitive internal endpoints, even when exposed via the API Gateway.

## Steps

### 1. Auth Service Issues Service JWTs
- The `auth-service` provides an endpoint for services to authenticate (using client credentials or a shared secret).
- It issues a JWT with a claim like `service: payment-service` or a role like `ROLE_PAYMENT_SERVICE`.

### 2. payment-service Obtains and Uses JWT
- On startup or before making a call, `payment-service` authenticates with `auth-service` and gets a JWT.
- The JWT is attached as a Bearer token in the `Authorization` header for internal calls to `order-service`.

### 3. API Gateway Validates JWT
- The API Gateway is configured to validate JWTs for all incoming requests.
- It checks the signature, expiration, and claims.
- For the internal endpoint, it checks that the JWT has the correct service claim.

### 4. order-service Secures the Endpoint
- The endpoint in `order-service` is protected with Spring Security.
- It requires a valid JWT with the correct service claim.
- Only requests with a valid service JWT (not user JWTs) can access the endpoint.

## Example Implementation

### Auth Service (Service Token Endpoint)
- POST `/auth/service/token` with client credentials.
- Returns a JWT with `service: payment-service` claim.

### payment-service (Feign Client or RestTemplate)
- Fetch JWT from `auth-service`.
- Attach JWT as `Authorization: Bearer <token>` header in requests to `order-service`.

### API Gateway (Spring Cloud Gateway)
- Configure JWT validation for all routes.
- For the internal endpoint, require the `service` claim to match `payment-service`.

### order-service (Spring Security)
```java
@RestController
@RequestMapping("/internal/order")
public class InternalOrderController {
    @PreAuthorize("hasAuthority('ROLE_PAYMENT_SERVICE')")
    @PostMapping("/{id}/state")
    public ResponseEntity<?> updateOrderState(@PathVariable Long id, @RequestBody StateUpdateRequest req) {
        // ... update logic ...
        return ResponseEntity.ok().build();
    }
}
```

## Security Notes
- Do NOT allow user JWTs to have the `service` claim or required authority.
- Do NOT expose the internal endpoint in the public API Gateway routes.
- Optionally, restrict the endpoint to only accept requests from internal network IPs.

## Summary Table
| Method         | Security | Complexity | Best For                |
|----------------|----------|------------|-------------------------|
| Shared Secret  | Low      | Low        | Dev/test, simple setups |
| JWT            | High     | Medium     | Most production setups  |
| mTLS           | Very High| High       | Regulated environments  |

## References
- [Spring Security OAuth2 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Spring Cloud Gateway JWT Auth](https://docs.spring.io/spring-cloud-gateway/reference/security.html)
- [Feign Interceptor for JWT](https://cloud.spring.io/spring-cloud-openfeign/reference/html/#spring-cloud-feign-oauth2)

---

This approach ensures that only the `payment-service` can update order states in a secure, scalable, and production-ready manner.

