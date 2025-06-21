package com.smartlist.services;

import com.smartlist.config.PropertiesConfig;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecureDigestAlgorithm;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.Random;

@Service
public class CryptoService {

    //Autowired
    final PropertiesConfig propertiesConfig;

    //Global
    private final Random random = new Random();

    public CryptoService(final PropertiesConfig propertiesConfig){
        this.propertiesConfig = propertiesConfig;
    }

    public boolean comparePassword(String plainTextPassword, String hashedPassword){
        return BCrypt.checkpw(plainTextPassword, hashedPassword);
    }

    public String generatePassword(String plainPassword){
        int saltRounds = 10;
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(saltRounds));

    }

    public String generateToken() {
        return generateToken(50);
    }

    public String generateToken(int size) {
        return RandomStringUtils.randomAlphanumeric(size);
    }

    public String generateHash(String stringToHash) throws NoSuchAlgorithmException {
        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        messageDigest.update(stringToHash.getBytes());
        return Base64.getEncoder().encodeToString(messageDigest.digest());

    }

    public String generateRandomString(){
        return RandomStringUtils.random(16, true, true);
    }


}
