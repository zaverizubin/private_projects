package com.smartlist.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

@Configuration
public class ThymeleafConfiguration {
    @Bean
    public TemplateEngine templateEngine() {
        TemplateEngine templateEngine = new TemplateEngine();

        ClassLoaderTemplateResolver templateResolver1 = thymeleafTemplateResolver();
        templateResolver1.setPrefix("/templates/report_templates/");
        templateResolver1.setOrder(0);
        templateEngine.addTemplateResolver(templateResolver1);


        ClassLoaderTemplateResolver templateResolver2 = thymeleafTemplateResolver();
        templateResolver2.setPrefix("/templates/email_templates/");
        templateResolver2.setOrder(1);
        templateEngine.addTemplateResolver(templateResolver2);

        return templateEngine;
    }


    private ClassLoaderTemplateResolver thymeleafTemplateResolver() {
        ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
        templateResolver.setTemplateMode(TemplateMode.HTML);
        templateResolver.setCharacterEncoding("UTF-8");
        templateResolver.setSuffix(".html");
        templateResolver.setCacheable(false);
        templateResolver.setCheckExistence(true);

        return templateResolver;
    }

}
