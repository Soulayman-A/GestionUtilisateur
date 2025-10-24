package com.example.security.controller;

import com.example.security.dto.UserDTO;
import com.example.security.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    // Récupère tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = authService.getAllUsers();
        System.out.println("Users récupérés: " + users);
        return ResponseEntity.ok(users);

    }

    // Change le rôle d'un utilisateur
    @PutMapping("/{userId}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long userId, @RequestBody String newRole) {
        try {
            newRole = newRole.replace("\"", "");
            authService.updateRole(userId, newRole);
            return ResponseEntity.ok("Role updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
