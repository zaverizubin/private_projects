package nexusglobal.wordprocessor.config.security;


import nexusglobal.wordprocessor.dao.UserDao;
import nexusglobal.wordprocessor.interfaces.Loggable;
import nexusglobal.wordprocessor.model.CustomPrincipal;
import nexusglobal.wordprocessor.model.entities.User;
import nexusglobal.wordprocessor.utils.SecurityUtils;
import org.apache.shiro.authc.credential.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component(value = "authenticationManager")
public class CustomAuthenticationManager implements AuthenticationManager, Loggable {


    private final PasswordService passwordService;
    private final UserDao userDao;

    @Autowired
    public CustomAuthenticationManager(final PasswordService passwordService, final SecurityUtils securityUtils, final UserDao userDao) {
        super();
        this.passwordService = passwordService;
        this.userDao = userDao;

        securityUtils.setAuthenticationManager(this);
    }

    private User getUser(String username) {
        /*final Optional<User> existingUser = this.userDao.findByUsername(username);
        if (!existingUser.isPresent()) {
            throw new AuthenticationCredentialsNotFoundException("Invalid user");
        }
        return existingUser.get();*/
        if (!username.equalsIgnoreCase("admin")) {
            throw new AuthenticationCredentialsNotFoundException("Invalid username");
        }
        User user = new User();
        user.setUserName("admin");
        user.setPlainPassword("admin");
        return user;
    }

    private void verifyPassword(String plainTextPassword, User existingUser) {
        /*final boolean passwordMatches = this.passwordService.passwordsMatch(plainTextPassword, existingUser.getHashedPassword());
        if (!passwordMatches) {
            throw new AuthenticationCredentialsNotFoundException("Invalid password");
        }*/
        boolean passwordMatches = plainTextPassword.toLowerCase().equals(existingUser.getPlainPassword());
        if (!passwordMatches) {
            throw new AuthenticationCredentialsNotFoundException("Invalid password");
        }
    }

    @Override
    public Authentication authenticate(final Authentication authentication) throws AuthenticationException {
        final String username = authentication.getName();
        final String plainTextPassword = authentication.getCredentials().toString();

        final User existingUser = getUser(username);
        verifyPassword(plainTextPassword, existingUser);

        final CustomPrincipal customPrincipal = new CustomPrincipal(existingUser);
        return new UsernamePasswordAuthenticationToken(customPrincipal, plainTextPassword, Collections.singletonList(new SimpleGrantedAuthority("admin")));
    }

}
