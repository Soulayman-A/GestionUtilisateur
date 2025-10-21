package com.example.security.dto;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String username;
    private String tokenType = "Bearer";

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, String refreshToken, String username) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.username = username;
    }

    public AuthResponse(String accessToken, String refreshToken, String username, String tokenType) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.username = username;
        this.tokenType = tokenType;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}