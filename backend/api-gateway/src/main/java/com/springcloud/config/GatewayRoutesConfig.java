//package com.springcloud.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cloud.gateway.route.RouteLocator;
//import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class GatewayRoutesConfig {
//
//    @Autowired
//    private JwtAuthenticationFilter jwtAuthFilter;
//
//    @Bean
//    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
//        return builder.routes()
//                .route("auth-service", r -> r.path("/api/auth/**")
//                        .uri("lb://auth-service"))
//
//                .route("product-service", r -> r.path("/products/**")
////                        .filters(f -> f.filter(jwtAuthFilter))
//                        .uri("lb://product-service"))
//
//                .route("analysis-service", r -> r.path("/analysis/**")
////                        .filters(f -> f.filter(jwtAuthFilter))
//                        .uri("lb://analysis-service"))
//
//                .build();
//    }
//}
