package com.springcloud.service;

import com.springcloud.common.enums.Status;
import com.springcloud.dto.AuthRequest;
import com.springcloud.dto.AuthResponse;
import com.springcloud.dto.RegisterRequest;
import com.springcloud.model.Role;
import com.springcloud.model.User;
import com.springcloud.repository.RoleRepository;
import com.springcloud.repository.UserRepository;
import com.springcloud.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        Role role = roleRepository.findByName(request.role().name());

        var user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .roles(Set.of(role))
                .nic(request.nic())
                .email(request.email())
                .phoneNo(request.phoneNo())
                .status("PENDING")
                .build();
        userRepository.save(user);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("isTemp", true);

        var jwtToken = jwtService.generateToken(extraClaims, user);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if(user.getStatus().equals("PENDING")){
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("isTemp", true);
            var jwtToken = jwtService.generateToken(extraClaims, user);
            return new AuthResponse(jwtToken);
        }
        var jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }
}