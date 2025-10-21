package com.example.security.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.security.dto.AuthResponse;
import com.example.security.dto.LoginRequest;
import com.example.security.dto.RefreshTokenRequest;
import com.example.security.dto.RegisterRequest;
import com.example.security.entity.RefreshToken;
import com.example.security.entity.User;
import com.example.security.service.AuthService;
import com.example.security.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    public AuthController(AuthService authService,
                          PasswordEncoder passwordEncoder,
                          RefreshTokenService refreshTokenService) {
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        User user = authService.register(request.getUsername(), request.getPassword());
        return ResponseEntity.ok("User registered successfully: " + user.getUsername());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        UserDetails userDetails = authService.loadUserByUsername(request.getUsername());

        if (!passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            return ResponseEntity.status(401).body("Identifiants invalides");
        }

        String role = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        String accessToken = authService.login(userDetails.getUsername(), role);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername());

        AuthResponse response = new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        if (requestRefreshToken == null || requestRefreshToken.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Refresh token is required");
        }

        try {
            RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken)
                    .orElseThrow(() -> new RuntimeException("Refresh token not found"));

            refreshToken = refreshTokenService.verifyExpiration(refreshToken);
            User user = refreshToken.getUser();

            String role = user.getRole();

            String accessToken = authService.login(user.getUsername(), role);

            AuthResponse response = new AuthResponse(
                    accessToken,
                    requestRefreshToken,
                    user.getUsername()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired refresh token: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        if (requestRefreshToken == null || requestRefreshToken.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Refresh token is required");
        }

        refreshTokenService.findByToken(requestRefreshToken)
                .ifPresent(token -> refreshTokenService.deleteByUserId(token.getUser().getId()));

        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> admin(Authentication authentication) {
        if (authentication == null) {
            logger.warn("Authentication is null !");
            return ResponseEntity.status(401).body("Not authenticated");
        }

        logger.info("Authentication object: {}", authentication);
        logger.info("Principal: {}", authentication.getPrincipal());
        logger.info("Name: {}", authentication.getName());
        logger.info("Is authenticated: {}", authentication.isAuthenticated());

        logger.info("Authorities:");
        authentication.getAuthorities().forEach(auth ->
                logger.info(" - Authority: {}", auth.getAuthority())
        );

        String username = authentication.getName();
        String roles = authentication.getAuthorities()
                .stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.joining(", "));

        return ResponseEntity.ok("Access granted: " + roles);
    }

}