package com.handloom.dto;

import lombok.Data;

public class AuthDtos {

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String role;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String phone;
        private boolean active;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private UserResponse user;
    }
}
