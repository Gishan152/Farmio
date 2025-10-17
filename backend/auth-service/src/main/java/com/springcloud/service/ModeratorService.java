package com.springcloud.service;

import com.springcloud.config.JwtService;
import com.springcloud.dto.*;
import com.springcloud.model.Role;
import com.springcloud.model.User;
import com.springcloud.repository.RoleRepository;
import com.springcloud.repository.UserRepository;
import com.springcloud.repository.ModeratorActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ModeratorService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ModeratorActivityService activityService;
    // Removed unused ObjectMapper

    /**
     * Create a new moderator with a temporary password
     */
    public ModeratorResponse createModerator(ModeratorCreateRequest request) {
        // Validate request
        if (request == null) {
            throw new IllegalArgumentException("Moderator request cannot be null");
        }
        
        if (request.email() == null || request.email().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (request.nic() == null || request.nic().trim().isEmpty()) {
            throw new IllegalArgumentException("NIC is required");
        }
        
        if (request.phone() == null || request.phone().trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }
        
        // Check if email already exists
        var existingUser = userRepository.findByEmail(request.email());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Account already exists with the provided email");
        }

        // Generate a unique username based on email prefix or name
        String username = generateUsername(request.name());
        existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            // If username exists, append a random number and check again
            int attempts = 0;
            String tempUsername;
            do {
                tempUsername = username + new SecureRandom().nextInt(1000);
                existingUser = userRepository.findByUsername(tempUsername);
                attempts++;
            } while (existingUser.isPresent() && attempts < 5);
            
            if (existingUser.isPresent()) {
                // Use timestamp to ensure uniqueness
                username = username + System.currentTimeMillis();
            } else {
                username = tempUsername;
            }
        }

        // Find moderator role
        Role role = roleRepository.findByName("ROLE_MODERATOR");
        if (role == null) {
            // If role doesn't exist, create it
            role = new Role();
            role.setName("ROLE_MODERATOR");
            roleRepository.save(role);
        }

        // Use provided temporary password or generate one
        String password = request.temporaryPassword();
        if (password == null || password.isEmpty()) {
            password = generateTemporaryPassword();
        }

        // Create the user with moderator role and first login flag
        var user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .roles(Set.of(role))
                .nic(request.nic())
                .email(request.email())
                .phoneNo(request.phone())
                .address(request.address())
                .status("Active")
                .isFirstLogin(true)
                .build();
        
        user = userRepository.save(user);

        // Log the activity
        activityService.logActivity(user.getId(), "ACCOUNT_CREATED", "Admin created moderator account");

        return new ModeratorResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                "Moderator account created successfully with temporary password."
        );
    }

    /**
     * Get all moderators
     */
    public List<ModeratorDTO> getAllModerators() {
        List<ModeratorDTO> moderators = new ArrayList<>();
        
        // Find all users with moderator role
        List<User> users = userRepository.findAll();
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String currentDate = LocalDateTime.now().format(formatter);
        
        for (User user : users) {
            boolean isModerator = user.getRoles().stream()
                    .anyMatch(role -> role.getName().equals("ROLE_MODERATOR"));
            
            if (isModerator) {
                ModeratorDTO dto = new ModeratorDTO(
                        user.getId(),
                        user.getUsername(),  // Using username as name temporarily
                        user.getUsername(),
                        user.getNic(),
                        user.getEmail(),
                        user.getPhoneNo(),
                        user.getAddress(),
                        "Moderator", // Default role display name
                        "User Support", // Default department
                        user.getStatus()
                );
                
                // Set activity level (mock data)
                dto.setActivityLevel("Medium");
                
                // Set join date (mock data)
                dto.setJoinDate("2023-01-01");
                
                // Set last active (mock data)
                dto.setLastActive(currentDate);
                
                // Set permissions (mock data)
                Map<String, Map<String, Boolean>> permissions = new HashMap<>();
                permissions.put("content", createPermissionMap(true, true, true));
                permissions.put("products", createPermissionMap(true, false, false));
                dto.setPermissions(permissions);
                
                moderators.add(dto);
            }
        }
        
        return moderators;
    }

    /**
     * Update a moderator's information
     */
    public ModeratorResponse updateModerator(Long id, ModeratorUpdateRequest request) {
        if (id == null) {
            throw new IllegalArgumentException("Moderator ID cannot be null");
        }
        
        if (request == null) {
            throw new IllegalArgumentException("Update request cannot be null");
        }
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Moderator not found with ID: " + id));
        
        // Verify this is a moderator
        boolean isModerator = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_MODERATOR"));
        
        if (!isModerator) {
            throw new RuntimeException("User is not a moderator. Cannot update.");
        }
        
        // Validate email format if provided
        if (request.email() != null && !request.email().isEmpty()) {
            if (!request.email().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
                throw new IllegalArgumentException("Invalid email format");
            }
        }
        
        // Validate phone format if provided
        if (request.phone() != null && !request.phone().isEmpty()) {
            if (!request.phone().matches("^\\d{10}$")) {
                throw new IllegalArgumentException("Phone number must be exactly 10 digits");
            }
        }
        
        // Update fields
        if (request.email() != null && !request.email().equals(user.getEmail())) {
            // Check if new email is already used
            var existingEmail = userRepository.findByEmail(request.email());
            if (existingEmail.isPresent() && !existingEmail.get().getId().equals(id)) {
                throw new RuntimeException("Email is already in use by another account");
            }
            user.setEmail(request.email());
        }
        
        if (request.nic() != null) {
            user.setNic(request.nic());
        }
        
        if (request.phone() != null) {
            user.setPhoneNo(request.phone());
        }
        
        if (request.address() != null) {
            user.setAddress(request.address());
        }
        
        try {
            user = userRepository.save(user);
            
            // Log the activity
            activityService.logActivity(id, "ACCOUNT_UPDATED", "Admin updated moderator account information");
        } catch (Exception e) {
            throw new RuntimeException("Failed to update moderator: " + e.getMessage());
        }
        
        return new ModeratorResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                "Moderator updated successfully"
        );
    }

    /**
     * Delete a moderator
     */
    public void deleteModerator(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Moderator ID cannot be null");
        }
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Moderator not found with ID: " + id));
        
        // Verify this is a moderator
        boolean isModerator = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_MODERATOR"));
        
        if (!isModerator) {
            throw new RuntimeException("User is not a moderator. Cannot delete.");
        }
        
        try {
            Long userId = user.getId();
            
            // Log the activity before deletion
            activityService.logActivity(userId, "ACCOUNT_DELETED", "Admin deleted moderator account");
            
            userRepository.delete(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete moderator: " + e.getMessage());
        }
    }

    /**
     * Reset a moderator's password to a new temporary password
     */
    public PasswordResetResponse resetModeratorPassword(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Moderator ID cannot be null");
        }
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Moderator not found with ID: " + id));
        
        // Verify this is a moderator
        boolean isModerator = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_MODERATOR"));
        
        if (!isModerator) {
            throw new RuntimeException("User is not a moderator. Cannot reset password.");
        }
        
        // Check if account is active
        if (user.getStatus() != null && !user.getStatus().equalsIgnoreCase("Active")) {
            throw new RuntimeException("Cannot reset password for inactive moderator account.");
        }
        
        // Generate new temporary password
        String temporaryPassword = generateTemporaryPassword();
        
        // Update user
        user.setPassword(passwordEncoder.encode(temporaryPassword));
        // Set isFirstLogin to true using Lombok setter (isFirstLogin -> setIsFirstLogin)
        // For a boolean field with is prefix, Lombok generates setters without the "is"
        user.setFirstLogin(true);
        user = userRepository.save(user);
        
        // Log the activity
        activityService.logActivity(id, "PASSWORD_RESET", "Admin reset moderator password");
        
        return new PasswordResetResponse(
                temporaryPassword,
                "Password reset successfully. The moderator will need to change it on next login."
        );
    }

    /**
     * Change a moderator's temporary password
     */
    public AuthResponse changeTemporaryPassword(PasswordChangeRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Password change request cannot be null");
        }
        
        if (request.email() == null || request.email().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (request.temporaryPassword() == null || request.temporaryPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Current password is required");
        }
        
        if (request.newPassword() == null || request.newPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("New password is required");
        }
        
        // Password strength validation
        if (request.newPassword().length() < 8) {
            throw new IllegalArgumentException("New password must be at least 8 characters long");
        }
        
        if (!request.newPassword().matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("New password must contain at least one uppercase letter");
        }
        
        if (!request.newPassword().matches(".*[a-z].*")) {
            throw new IllegalArgumentException("New password must contain at least one lowercase letter");
        }
        
        if (!request.newPassword().matches(".*[0-9].*")) {
            throw new IllegalArgumentException("New password must contain at least one digit");
        }
        
        if (!request.newPassword().matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            throw new IllegalArgumentException("New password must contain at least one special character");
        }
        
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.email()));
        
        // Verify this is a moderator
        boolean isModerator = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_MODERATOR"));
        
        if (!isModerator) {
            throw new RuntimeException("User is not a moderator. Access denied.");
        }
        
        // Verify current password
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            request.temporaryPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            throw new RuntimeException("Invalid current password. Please try again.");
        }
        
        // Update password and first login flag
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        // For boolean fields with 'is' prefix, Lombok generates setters without the "is"
        user.setFirstLogin(false);
        user = userRepository.save(user);
        
        // Log the activity
        activityService.logActivity(user.getId(), "PASSWORD_CHANGED", "Moderator changed temporary password");
        
        // Generate token
        var jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }
    
    /**
     * Authenticate a moderator login
     */
    public ModeratorLoginResponse moderatorLogin(AuthRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Authentication request cannot be null");
        }
        
        if (request.email() == null || request.email().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (request.password() == null || request.password().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.email()));
        
        // Verify this is a moderator
        boolean isModerator = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_MODERATOR"));
        
        if (!isModerator) {
            throw new RuntimeException("User is not a moderator. Access denied.");
        }
        
        // Check if account is active
        if (user.getStatus() != null && !user.getStatus().equalsIgnoreCase("Active")) {
            throw new RuntimeException("Moderator account is not active. Please contact an administrator.");
        }
        
        // Verify password
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            request.password()
                    )
            );
        } catch (BadCredentialsException ex) {
            throw new RuntimeException("Invalid credentials. Please check your email and password.");
        }
        
        // Generate token
        var jwtToken = jwtService.generateToken(user);
        
        // Ensure we're correctly sending the isFirstLogin flag to the frontend
        boolean isFirstTimeLogin = user.isFirstLogin();
        
        // Log the activity
        activityService.logActivity(user.getId(), "LOGIN", 
            isFirstTimeLogin ? "Moderator logged in (first-time login)" : "Moderator logged in");
        
        System.out.println("User " + user.getEmail() + " login - isFirstLogin: " + isFirstTimeLogin);
        
        return new ModeratorLoginResponse(
                jwtToken,
                isFirstTimeLogin,
                user.getEmail(),
                "ROLE_MODERATOR"
        );
    }
    
    // Helper methods
    
    /**
     * Generate a username from a name
     */
    private String generateUsername(String name) {
        if (name == null || name.isEmpty()) {
            return "moderator" + new SecureRandom().nextInt(10000);
        }
        
        // Convert to lowercase, replace spaces with dots and remove special characters
        String username = name.toLowerCase()
                .replaceAll("\\s+", ".")
                .replaceAll("[^a-z0-9.]", "");
        
        // Ensure username is at least 3 characters long
        if (username.length() < 3) {
            username = username + "mod" + new SecureRandom().nextInt(100);
        }
        
        return username;
    }
    
    /**
     * Generate a secure temporary password
     */
    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        StringBuilder password = new StringBuilder();
        SecureRandom random = new SecureRandom();
        
        for (int i = 0; i < 10; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return password.toString();
    }
    
    /**
     * Create a permission map with the given values
     */
    private Map<String, Boolean> createPermissionMap(boolean view, boolean edit, boolean delete) {
        Map<String, Boolean> map = new HashMap<>();
        map.put("view", view);
        map.put("edit", edit);
        map.put("delete", delete);
        return map;
    }
}
