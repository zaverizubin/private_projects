package com.smartlist.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartlist.enums.Role;
import com.smartlist.model.AuthorizedToken;
import com.smartlist.model.Candidate;
import com.smartlist.model.User;
import com.smartlist.module.auth.AuthRepository;
import com.smartlist.module.auth.AuthResponseCodes;
import com.smartlist.module.candidate.CandidateRepository;
import com.smartlist.module.user.UserRepository;
import com.smartlist.services.CryptoService;
import com.smartlist.services.JWTService;
import com.smartlist.utils.AppResponseCodes;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final CryptoService cryptoService;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final AuthRepository authRepository;

    @Override
    protected void doFilterInternal(final HttpServletRequest request, final @NotNull HttpServletResponse response, final @NotNull FilterChain filterChain)
            throws ServletException, IOException {

        // Is token valid
        String jwt = this.jwtService.getBearerTokenFromHeader(request.getHeader(HttpHeaders.AUTHORIZATION));

        if(jwt == null || !this.jwtService.isTokenValid(jwt)){
           filterChain.doFilter(request, response);
            return;
        }

        // has token been revoked
        String accessTokenHash = "";
        try {
            accessTokenHash = this.cryptoService.generateHash(jwt);
        }catch (NoSuchAlgorithmException ex){
            throw AppResponseCodes.INTERNAL_SERVER_ERROR;
        }

        Optional<AuthorizedToken> optionalAuthorizedToken = this.authRepository.findByAccessTokenHash(accessTokenHash);
        if(optionalAuthorizedToken.isEmpty()){
            filterChain.doFilter(request, response);
            return;
        }

        Optional<Candidate> optionalCandidate;
        Optional<User> optionalUser;
        UserDetails userDetails=null;

        // Get user identity and set it on the spring security context
        String username = this.jwtService.extractUsername(jwt);
        Role role = this.jwtService.getRole(jwt);

        if(SecurityContextHolder.getContext().getAuthentication() == null && username != null){
            if(role != null && role.equals(Role.CANDIDATE)){
                optionalCandidate = this.candidateRepository.findByEmail(username);
                if(optionalCandidate.isPresent()){
                    userDetails = optionalCandidate.get();
                }
            }else{
                optionalUser = this.userRepository.findByEmail(username);
                if(optionalUser.isPresent()){
                    userDetails = optionalUser.get();
                }
            }

            if(userDetails!= null){
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(userDetails,
                        userDetails.getPassword(), userDetails.getAuthorities());

                token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(token);
            }

        }

        filterChain.doFilter(request, response);
    }

}
