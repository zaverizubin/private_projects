package nexusglobal.controlpanel.utils;

import nexusglobal.controlpanel.interfaces.Loggable;
import nexusglobal.controlpanel.model.CustomPrincipal;
import nexusglobal.controlpanel.model.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.stereotype.Component;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.Serializable;

@Component
@Priority(1)
public class SecurityUtils implements Loggable, Serializable {

    private static final String CURRENT_VIEW = "currentView";

    // Global Variables

    // Autowired Components

    @Autowired
    private HttpServletRequest request;

    private AuthenticationManager authenticationManager;

    public SecurityUtils() {
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }


    public void setAuthenticationManager(final AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public void login(final String emailAddress, final String plainTextPassword) throws AuthenticationException {
        final Authentication authentication = new UsernamePasswordAuthenticationToken(emailAddress, plainTextPassword);
        final UsernamePasswordAuthenticationToken result = (UsernamePasswordAuthenticationToken) this.authenticationManager.authenticate(authentication);
        SecurityContextHolder.getContext().setAuthentication(result);
    }

    public void logout() {
        this.request.getSession().invalidate();
        SecurityContextHolder.getContext().setAuthentication(null);
        NavigationController.refreshPage();
    }


    public DefaultSavedRequest getOriginalRequest() {
        /*Navigate to the requested page:
        This is to redirect a user back to the originally requested URL – after they log in as we are not using
        Spring's AuthenticationSuccessHandler.
        */
        final HttpSession session = this.request.getSession(false);
        return (DefaultSavedRequest) session.getAttribute("SPRING_SECURITY_SAVED_REQUEST");

    }

    public boolean isUserLoggedIn() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && !(authentication instanceof AnonymousAuthenticationToken);
    }

    public CustomPrincipal getCustomPrincipal() {
        final SecurityContext context = SecurityContextHolder.getContext();
        final Authentication authentication = context.getAuthentication();
        if (authentication != null) {
            return (CustomPrincipal) authentication.getPrincipal();
        } else {
            return new CustomPrincipal();
        }
    }


    public User getCurrentUser() {
        return getCustomPrincipal().getUser();
    }

    public Class<?> getCurrentView() {
        return (Class<?>) this.request.getSession().getAttribute(CURRENT_VIEW);
    }


}