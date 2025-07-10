package com.springcloud.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.List;

// If your filter implements GlobalFilter instead of GatewayFilter, it automatically runs for all routes without explicitly specifying it. However, for route-specific usage, implementing GatewayFilter is preferred

@Component
//public class AuthenticationFilter implements GatewayFilter {
public class AuthenticationFilter implements WebFilter {

    @Autowired
    private JwtService jwtService;
    @Autowired private RouterValidator routerValidator;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest req = exchange.getRequest();
        System.out.println("Executing AuthenticationFilter...");

        ServerHttpResponse res = exchange.getResponse();
        HttpHeaders headers = res.getHeaders();
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173");
        headers.addAll(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS,
                List.of("GET","POST","PUT","DELETE","OPTIONS"));
        headers.addAll(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, List.of("*"));
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
        headers.add(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "3600");

        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
            System.out.println("OPTIONS request handled.");
            res.setStatusCode(HttpStatus.OK);
            return res.setComplete();
        }

        if (routerValidator.isSecured(req)) {
            List<String> auth = req.getHeaders().getOrEmpty(HttpHeaders.AUTHORIZATION);
            if (auth.isEmpty() || !auth.get(0).startsWith("Bearer ")) {
                System.out.println("Error : JWT token is required");
                return this.onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
            }
            String token = auth.get(0).substring(7);
            try {
//                jwtService.validateToken(token);
                Claims claims = jwtService.extractAllClaims(token);
                System.out.println("JWT claims : " + claims);
                // header update

                @SuppressWarnings("unchecked")
                List<String> roles = claims.get("roles", List.class);
                String rolesCsv = String.join(",", roles);
                System.out.println("JWT roles : " + roles);

                ServerHttpRequest mutated = req.mutate()
                        .header("X-User-Id", claims.getSubject())
                        .header("X-Roles", rolesCsv)
                        .build();
                exchange.getAttributes().put("roles", roles);
                // context update
//                Authentication authContextData = new UsernamePasswordAuthenticationToken(
//                        claims.getSubject(),
//                        null,
//                        AuthorityUtils.commaSeparatedStringToAuthorityList(claims.get("roles", List.class))
//                );
                return chain.filter(exchange.mutate().request(mutated).build());
//                        .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authContextData));
//                        .contextWrite(ReactiveSecurityContextHolder.withAuthentication(upAuth));

            } catch (JwtException e) {
                return this.onError(exchange, "Invalid JWT: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
            }
        }
        return chain.filter(exchange);
    }

    private Mono<Void> onError(ServerWebExchange ex, String err, HttpStatus status) {
        ex.getResponse().setStatusCode(status);
        return ex.getResponse().setComplete();
    }
}
