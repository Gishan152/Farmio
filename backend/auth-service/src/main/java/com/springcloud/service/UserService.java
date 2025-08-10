package com.springcloud.service;

import com.springcloud.common.enums.Status;
import com.springcloud.dto.*;
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
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse registerFarmer(RegisterRequest request) {

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
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        request.password()
                )
        );
        if(user.getStatus().equals("PENDING")){
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("isTemp", true);
            var jwtToken = jwtService.generateToken(extraClaims, user);
            return new AuthResponse(jwtToken);
        }
        var jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }

    public PublicUserData getUser(UserRequest request){
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new PublicUserData(user.getUsername(), user.getId(), user.getEmail(), user.getStatus(), user.getPhoneNo());
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<UserDTO> getAllUsersDTO() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> {
                    UserDTO dto = new UserDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getStatus(),
                        user.getPhoneNo(),
                        user.getNic()
                    );
                    // Convert roles to string set
                    Set<String> roleNames = user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(java.util.stream.Collectors.toSet());
                    dto.setRoles(roleNames);
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    public void deactivateUser(UserRequest request) {
        // TODO Auto-generated method stub
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setStatus("DEACTIVATED");
        userRepository.save(user);
        
    }
}