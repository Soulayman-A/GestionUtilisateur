package com.example.security.controller;

import com.example.security.dto.UserDTO;
import com.example.security.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<UserDTO> users = authService.getAllUsers(pageable);

        System.out.println("Users récupérés - Page: " + page + ", Total: " + users.getTotalElements());
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
