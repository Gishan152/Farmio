package com.springcloud.config;

//import com.springcloud.config.JwtWebFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

//@Configuration
//@EnableWebFluxSecurity
//@EnableReactiveMethodSecurity
//public class SecurityConfig {

//    private final JwtWebFilter jwtWebFilter;
//
//    public SecurityConfig(JwtWebFilter jwtWebFilter) {
//        this.jwtWebFilter = jwtWebFilter;
//    }
//
//    @Bean
//    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
//        return http
//                .csrf(csrf -> csrf.disable())
//                .addFilterAt(jwtWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)
//                .authorizeExchange(exchanges -> exchanges
//                        .pathMatchers("/api/auth/**").permitAll()
//                        .pathMatchers("/api/user/**").hasRole("USER")
//                        .pathMatchers("/api/admin/**").hasRole("ADMIN")
//                        .anyExchange().authenticated()
//                )
//                .build();
//    }
//}

@Configuration
public class GatewaySecurityConfig {

//    @Autowired
//    AuthenticationFilter authFilter;

    @Bean
    SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .cors(Customizer.withDefaults())
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((exchange, ex) ->
                                Mono.fromRunnable(() -> exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED))
                        )
                )
                .authorizeExchange(ex -> ex
                        .pathMatchers("/**").permitAll()
                );
//                .addFilterAt(authFilter, SecurityWebFiltersOrder.AUTHENTICATION);
//                .authorizeExchange(ex -> ex
//                        .pathMatchers("/auth/login", "/auth/register").permitAll()
//                        .anyExchange().authenticated()
//                );

        return http.build();
    }

//    @Bean
//    public RouteLocator routes(RouteLocatorBuilder r) {
//        return r.routes()
//                .route("product", p -> p.path("/products/**")
//                        .filters(f -> f.filter(authFilter))
//                        .uri("lb://product-service"))
//                .route("auth", p -> p.path("/api/auth/**")
//                        .uri("lb://auth-service"))
//                .build();
//    }
}