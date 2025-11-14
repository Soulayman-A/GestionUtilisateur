package com.example.security.service;

import com.example.security.dto.AuthResponse;
import com.example.security.dto.UserDTO;
import com.example.security.entity.User;
import com.example.security.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User register(String username, String email, String password) {

        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username cannot be null or empty");
        }

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email cannot be null or empty");
        }

        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password cannot be null or empty");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(username.trim());
        user.setEmail(email.trim());
        //Encode le MDP
        user.setPassword(passwordEncoder.encode(password));
        // Attribut le rôle utilisateur dès la création du compte
        user.setRole("ROLE_USER");

        return userRepository.save(user);
    }
    // Génère le token pour l'utilisateur
    public String login(String username, String role) {
        return jwtService.generateToken(username, role);
    }

    public Page<UserDTO> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(user -> new UserDTO(user.getId(), user.getUsername(), user.getRole()));
    }

    public void updateRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Vérifie le format du rôle
        if (!newRole.startsWith("ROLE_")) {
            newRole = "ROLE_" + newRole.toUpperCase();
        }

        user.setRole(newRole);
        userRepository.save(user);
    }


    //Charge les utilisateurs par leurs nom d'utilisateur.
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getRole().trim()))
        );

    }
}