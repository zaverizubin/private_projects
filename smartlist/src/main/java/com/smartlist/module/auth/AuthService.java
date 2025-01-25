package com.smartlist.module.auth;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartlist.enums.Role;
import com.smartlist.model.AuthorizedToken;
import com.smartlist.model.Candidate;
import com.smartlist.model.User;
import com.smartlist.module.auth.dto.request.AuthReqDTO;
import com.smartlist.module.auth.dto.response.AuthRespDTO;
import com.smartlist.module.candidate.CandidateRepository;
import com.smartlist.module.user.UserRepository;
import com.smartlist.services.CryptoService;
import com.smartlist.services.JWTService;
import com.smartlist.utils.AppResponseCodes;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final AuthRepository authRepository;
    private final CandidateRepository candidateRepository;
    private final CryptoService cryptoService;
    private final JWTService jwtService;

    public AuthService(final AuthenticationManager authenticationManager, final UserRepository userRepository, final AuthRepository authRepository,
                       final CandidateRepository candidateRepository, final CryptoService cryptoService,
                       final JWTService jwtService){
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.authRepository = authRepository;
        this.candidateRepository = candidateRepository;
        this.cryptoService = cryptoService;
        this.jwtService = jwtService;
    }


    @Transactional
    public AuthRespDTO loginUser(final AuthReqDTO authReqDTO) {
        try {
            Authentication authenticate = this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authReqDTO.getEmail(), authReqDTO.getPassword()
            ));

            User user = (User) authenticate.getPrincipal();

            String accessToken = this.jwtService.buildJWTToken(user);
            String accessTokenHash = "";
            try {
                accessTokenHash = this.cryptoService.generateHash(accessToken);
            }catch (NoSuchAlgorithmException ex){
                throw AppResponseCodes.BAD_REQUEST;
            }

            AuthorizedToken authorizedToken = new AuthorizedToken();
            authorizedToken.setAccessTokenHash(accessTokenHash);
            authorizedToken.setRefreshTokenHash("");
            authorizedToken.setUser(user);
            this.authRepository.deleteByUser(user);
            this.authRepository.save(authorizedToken);

            return new AuthRespDTO(user.getId(), accessToken);

        }catch (BadCredentialsException ex) {
            throw AppResponseCodes.UNAUTHORISED;
        }

    }

    @Transactional
    public AuthRespDTO loginCandidate(final Candidate candidate) {
        HashMap<String, String> claims = new HashMap<>();
        claims.put("id", String.valueOf(candidate.getId()));
        claims.put("role", Role.CANDIDATE.name());

        ObjectMapper objectMapper = new ObjectMapper();

        String accessToken = this.jwtService.generateToken(candidate.getEmail(), claims);
        String accessTokenHash ="";
        try {
            accessTokenHash = this.cryptoService.generateHash(objectMapper.writeValueAsString(claims));
        }catch (JsonProcessingException | NoSuchAlgorithmException ex){
            throw AppResponseCodes.BAD_REQUEST;
        }


        AuthorizedToken authorizedToken  = new AuthorizedToken();
        authorizedToken.setAccessTokenHash(accessTokenHash);
        authorizedToken.setRefreshTokenHash("");
        authorizedToken.setCandidate(candidate);

        this.authRepository.deleteByCandidate(candidate);
        this.authRepository.save(authorizedToken);

        return new AuthRespDTO(candidate.getId(), accessToken);

    }

    @Transactional
    public void logout(final HttpServletRequest request) {
        String jwt = this.jwtService.getBearerTokenFromHeader(request.getHeader(HttpHeaders.AUTHORIZATION));
        if (this.jwtService.getRole(jwt).equals(Role.CANDIDATE)) {
            Optional<Candidate> optionalCandidate = this.candidateRepository.findByEmail(this.jwtService.extractUsername(jwt));
            optionalCandidate.ifPresent(this.authRepository::deleteByCandidate);
        } else {
            Optional<User> optionalUser = this.userRepository.findByEmail(this.jwtService.extractUsername(jwt));
            optionalUser.ifPresent(this.authRepository::deleteByUser);
        }
    }

    private ResponseStatusException throwIfUserNotDefined()  {
        return AuthResponseCodes.USER_CREDENTIALS_INVALID;
    }


}
