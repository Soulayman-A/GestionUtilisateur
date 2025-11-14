package com.example.security.controller;

import com.example.security.service.MailtrapEmailService;
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
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.security.service.MailtrapEmailService;


import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final MailtrapEmailService mailService;

    public AuthController(AuthService authService,
                          PasswordEncoder passwordEncoder,
                          RefreshTokenService refreshTokenService, MailtrapEmailService mailService) {
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.mailService = mailService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        User user = authService.register(request.getUsername(), request.getEmail(), request.getPassword());
        mailService.sendEmailTo(user.getEmail());

        return ResponseEntity.ok("User registered successfully: " + user.getUsername());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        UserDetails userDetails = authService.loadUserByUsername(request.getUsername());

        if (!passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            return ResponseEntity.status(401).body("Identifiants invalides");
        }

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");

        String accessToken = authService.login(userDetails.getUsername(), role);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername());

        // Créer un cookie httpOnly
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Strict")
                .build();

        // réponse sans refresh token dans le JSON
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(new AuthResponse(accessToken, userDetails.getUsername()));
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue("refreshToken") String refreshToken) {

        RefreshToken token = refreshTokenService.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        token = refreshTokenService.verifyExpiration(token);

        User user = token.getUser();
        String newAccessToken = authService.login(user.getUsername(), user.getRole());

        return ResponseEntity.ok(new AuthResponse(newAccessToken, user.getUsername()));
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue("refreshToken") String refreshToken) {

        // Supprimer le refresh token dans la BDD
        refreshTokenService.deleteByToken(refreshToken);

        // Supprimer le cookie
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)   // Supprime le cookie direct
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", deleteCookie.toString())
                .body("Logout successful");
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