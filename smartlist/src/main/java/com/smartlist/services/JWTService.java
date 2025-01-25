package com.smartlist.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartlist.config.PropertiesConfig;
import com.smartlist.enums.Role;
import com.smartlist.model.User;
import io.jsonwebtoken.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.print.DocFlavor;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    //Autowired
    final PropertiesConfig propertiesConfig;

    //Global
    SecretKey secretKey;

    public JWTService(final PropertiesConfig propertiesConfig){
        this.propertiesConfig = propertiesConfig;
    }

    private JwtParser getJwtParser(){
        JwtParserBuilder jwtParserBuilder = Jwts.parser();
        return jwtParserBuilder.verifyWith(getSignKey()).build();
    }

    private SecretKey getSignKey(){
        if(this.secretKey ==null){
            this.secretKey = Jwts.SIG.HS256.key().build();
        }
        return this.secretKey;
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(final String token) {
        return getJwtParser().parseSignedClaims(token).getPayload();
    }

    private boolean isTokenExpired(final String token){
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public String getBearerTokenFromHeader(final String header){
        if (StringUtils.isEmpty(header) || !header.startsWith("Bearer")) {
            return null;
        }
        return header.substring(7).trim();
    }

    public String generateToken(final String username, final Map<String, String> claims){
        JwtBuilder jwtBuilder = Jwts.builder();
        jwtBuilder.claims().subject(username);
        jwtBuilder.claims().add(claims);
        jwtBuilder.issuedAt(Date.from(Instant.now()))
                .expiration(DateUtils.addHours(Date.from(Instant.now()), 24))
                .signWith(getSignKey())
                .compact();

        return jwtBuilder.compact();
    }

    public boolean isTokenValid(final String token){
        try {
            getJwtParser().parseSignedClaims(token);
            return !isTokenExpired(token);
        } catch (JwtException e) {
            return false;
        }
    }

    public String extractUsername(final String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Role getRole(final String jwtToken) {
        String roleName =  (String)getJwtParser().parseSignedClaims(jwtToken).getPayload().get("role");
        if(roleName != null){
            try{
                return Role.valueOf(roleName);
            }catch (IllegalArgumentException e){
                return null;
            }
        }else{
            return null;
        }
    }

    public String buildJWTToken(final User user){
        HashMap<String, String> claims = new HashMap<>();
        claims.put("id", String.valueOf(user.getId()));
        claims.put("role", user.getRole().toString());

        return generateToken(user.getEmail(), claims);
    }

}
