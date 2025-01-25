package com.smartlist.security;

public record JWTToken(String email, String sub, String role) {

}
