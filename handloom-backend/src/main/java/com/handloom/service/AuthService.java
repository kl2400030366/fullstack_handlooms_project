package com.handloom.service;

import com.handloom.dto.AuthDtos.*;
import com.handloom.entity.User;
import com.handloom.repository.UserRepository;
import com.handloom.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.valueOf(req.getRole()))
                .active(true)
                .build();
        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        if (!user.isActive()) throw new RuntimeException("Account is deactivated");

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        UserResponse userResp = new UserResponse();
        userResp.setId(user.getId());
        userResp.setName(user.getName());
        userResp.setEmail(user.getEmail());
        userResp.setRole(user.getRole().name());
        userResp.setPhone(user.getPhone());
        userResp.setActive(user.isActive());

        LoginResponse resp = new LoginResponse();
        resp.setToken(token);
        resp.setUser(userResp);
        return resp;
    }
}
