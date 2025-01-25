package nexusglobal.controlpanel.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;

import javax.servlet.ServletContext;

public class SpringWebInitializer implements WebApplicationInitializer {

    @Autowired
    PropertiesConfig propertiesConfig;

    public void onStartup(final ServletContext servletContext) {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        if (context.getEnvironment().getActiveProfiles().length == 0) {
            servletContext.setInitParameter("spring.profiles.active", "dev");
        }
    }
}