package nexusglobal.wordprocessor.config.security;

import com.vaadin.flow.server.ServletHelper.RequestType;
import com.vaadin.flow.shared.ApplicationConstants;
import nexusglobal.wordprocessor.utils.SecurityUtils;
import org.apache.shiro.authc.credential.DefaultPasswordService;
import org.apache.shiro.authc.credential.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.DelegatingAuthenticationEntryPoint;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.context.request.RequestContextListener;

import javax.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.stream.Stream;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private SecurityUtils securityUtils;

    public SecurityConfig() {
        super(false);
        // TODO This line needs to be revisited to reliably support security context in background threads
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }

    public static boolean isFrameworkInternalRequest(final HttpServletRequest request) {
        final String parameterValue = request.getParameter(ApplicationConstants.REQUEST_TYPE_PARAMETER);
        return parameterValue != null && Stream.of(RequestType.values()).anyMatch(r -> r.getIdentifier().equals(parameterValue));
    }

    @Bean
    public DelegatingAuthenticationEntryPoint delegatingAuthenticationEntryPoint() {
        final RequestMatcher homeMatcher = request -> request.getServletPath().equals("/");
        final LinkedHashMap<RequestMatcher, AuthenticationEntryPoint> loginMap = new LinkedHashMap<>();
        final AuthenticationEntryPoint defaultEntryPoint = new LoginUrlAuthenticationEntryPoint("/login");
        loginMap.put(homeMatcher, defaultEntryPoint);

        final DelegatingAuthenticationEntryPoint entryPoint = new DelegatingAuthenticationEntryPoint(loginMap);
        entryPoint.setDefaultEntryPoint(defaultEntryPoint);

        return entryPoint;
    }

    /**
     * Allows access to static resources and login pages, bypassing Spring security.
     */
    @Override
    public void configure(final WebSecurity web) {
        web.ignoring().antMatchers(
                // Vaadin Flow static resources
                "/VAADIN/**",
                // the standard favicon URI
                "/favicon.ico",
                // the robots exclusion standard
                "/robots.txt",
                // web application manifest
                "/manifest.webmanifest", "/sw.js", "/offline-page.html",
                // icons and images
                "/icons/**", "/images/**",
                // (development mode) static resources
                "/frontend/**",
                // (development mode) webjars
                "/webjars/**",
                // (development mode) H2 debugging console
                "/h2-console/**",
                // (production mode) static resources
                "/frontend-es5/**", "/frontend-es6/**",
                // Login pages
                "/login",
                // DB update page
                "/db/update",
                // mxGraph resources
                "/resources/**", "/css/**");
    }

    @Override
    protected void configure(final HttpSecurity httpSecurity) throws Exception {

        // @formatter:off
        httpSecurity.authorizeRequests().antMatchers("/api/**").hasAnyAuthority("admin").and().sessionManagement().and().httpBasic();

        httpSecurity.csrf().disable() // CSRF handled by Vaadin
                // Add custom cache to prevent Vaadin framework requests from being cached
                .requestCache().requestCache(new CustomRequestCache())
                // Setup delegating entry point to decide which login page to use
                .and().exceptionHandling().authenticationEntryPoint(delegatingAuthenticationEntryPoint())
                // Restrict access to the app
                .and().authorizeRequests()
                // Allow all Vaadin framework internal requests without authentication
                .requestMatchers(SecurityConfig::isFrameworkInternalRequest).permitAll()
                .anyRequest().hasAnyAuthority("admin");


        // @formatter:on
    }

    @Bean
    public RequestContextListener requestContextListener() {
        return new RequestContextListener();
    }

    @Bean
    public PasswordService passwordService() {
        final DefaultPasswordService passwordService = new DefaultPasswordService();
        passwordService.setHashFormat(new Nexus1CryptFormat());
        passwordService.setHashFormatFactory(new CustomHashFormatFactory());
        return passwordService;
    }

    @Bean("springThreadPoolTaskExecutor")
    public ThreadPoolTaskExecutor threadPoolTaskExecutor() {
        final ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(100);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("async-");
        return executor;
    }

    @Bean
    @DependsOn("springThreadPoolTaskExecutor")
    public DelegatingSecurityContextAsyncTaskExecutor securityContextTaskExecutor(@Qualifier("springThreadPoolTaskExecutor") final ThreadPoolTaskExecutor delegate) {
        return new DelegatingSecurityContextAsyncTaskExecutor(threadPoolTaskExecutor());
    }

}
