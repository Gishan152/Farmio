//import org.springframework.context.annotation.Bean;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//
//import java.util.List;
//
//@Bean
//public CorsConfigurationSource corsConfigurationSource() {
//    CorsConfiguration config = new CorsConfiguration();
//    config.setAllowedOrigins(List.of("http://localhost:3000")); // adjust as needed
//    config.setAllowedMethods(List.of("*"));
//    config.setAllowedHeaders(List.of("*"));
//    config.setAllowCredentials(true); // credentials support
//
//    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//    source.registerCorsConfiguration("/**", config);
//    return source;
//}
