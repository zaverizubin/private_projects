package nexusglobal.controlpanel.config.security;

import org.springframework.security.web.savedrequest.HttpSessionRequestCache;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * HttpSessionRequestCache that avoids saving internal framework requests.
 */
class CustomRequestCache extends HttpSessionRequestCache {

    @Override
    public void saveRequest(final HttpServletRequest request, final HttpServletResponse response) {
        if (!SecurityConfig.isFrameworkInternalRequest(request)) {
            super.saveRequest(request, response);
        }
    }

}