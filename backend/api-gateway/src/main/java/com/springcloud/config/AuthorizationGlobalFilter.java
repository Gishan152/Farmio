package com.springcloud.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.*;

@Component
public class AuthorizationGlobalFilter implements GlobalFilter, Ordered {

    private final Map<String, List<String>> pathRoles = Map.of(
            "/products", List.of("ROLE_USER", "ROLE_ADMIN")
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        System.out.println("Executing AuthorizationGlobalFilter...");

        List<String> roles = exchange.getAttribute("roles");
        System.out.println("User roles : " + roles);
        assert roles != null;
        Iterator<String> paths = pathRoles.keySet().iterator();
        for(int i = 0; i < pathRoles.size(); i++){
            String p = paths.next();
            List<String> pRoles = pathRoles.get(p);
            System.out.println("path : " + p);
            System.out.println("path roles : " + pRoles);
            if (path.startsWith(p) && pRoles.stream().noneMatch(roles::contains)) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
        }

        return chain.filter(exchange);

//        return ReactiveSecurityContextHolder.getContext()
//                .flatMap(ctx -> {
//                    Authentication auth = ctx.getAuthentication();
//                    System.out.println("Authorities : " + auth.getAuthorities());
//                    if (path.startsWith("/products") &&
//                            (auth == null || auth.getAuthorities().stream()
//                                    .noneMatch(a -> a.getAuthority().equals("ROLE_FARMER")))) {
//                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
//                        return exchange.getResponse().setComplete();
//                    }
//                    return chain.filter(exchange);
//                })
//                .switchIfEmpty(chain.filter(exchange));
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
