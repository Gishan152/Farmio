//package com.springcloud.config;
//
//import com.springcloud.config.JwtService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.ReactiveSecurityContextHolder;
//import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//import org.springframework.web.server.WebFilter;
//import org.springframework.web.server.WebFilterChain;
//import reactor.core.publisher.Mono;
//
//@Component
//@RequiredArgsConstructor
//public class JwtWebFilter implements WebFilter {
//    private final JwtService jwtService;
//    private final ReactiveUserDetailsService userDetailsService;
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
//        String path = exchange.getRequest().getURI().getPath();
//        if (path.startsWith("/api/auth/")) {
//            return chain.filter(exchange); // skip auth endpoints
//        }
//
//        return Mono.justOrEmpty(exchange.getRequest().getHeaders().getFirst("Authorization"))
//                .filter(h -> h.startsWith("Bearer "))
//                .flatMap(h -> {
//                    String token = h.substring(7);
//                    String username = jwtService.extractUsername(token);
//                    return userDetailsService.findByUsername(username)
//                            .filter(user -> jwtService.isTokenValid(token, user))
//                            .flatMap(user -> {
//                                var auth = new UsernamePasswordAuthenticationToken(
//                                        user, null, user.getAuthorities());
//                                // Propagate reactive context with security
//                                return chain.filter(exchange)
//                                        .contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));
//                            });
//                })
//                .switchIfEmpty(chain.filter(exchange));
//    }
//}
