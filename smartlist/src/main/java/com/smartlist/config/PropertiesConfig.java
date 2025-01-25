package com.smartlist.config;

import com.smartlist.enums.SpringProfile;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

@Component
@Getter
@Setter
public class PropertiesConfig implements Serializable {

    public static final String SUPPORT_EMAIL_ADDRESS = "support@nexusglobal.com";

    // Autowired Components
    @Autowired
    private Environment springEnvironment;

    //Client and Server app variables
    @Value("${server.app.name}")
    private String serverAppName;
    @Value("${server.app.url}")
    private String serverAppURL;
    @Value("${server.app.helpcenter.url}")
    private String serverHelpCenterURL;
    @Value("${client.app.url}")
    private String clientAppURL;
    @Value("${client.app.port}")
    private String clientAppPort;

    //Route variables
    @Value("${route.verify.email}")
    private String routeVerifyEmail;
    @Value("${route.forgot.password}")
    private String routeForgotPassword;
    @Value("${route.invite.to.app}")
    private String routeInviteToApp;

    // Email variables
    @Value("${email.host:smtp.office365.com}")
    private String emailHost;
    @Value("${email.port:80}")
    private String emailPort;
    @Value("${email.username:'investigationoptimizer@nexusglobal.com'}")
    private String emailUsername;
    @Value("${email.password:'Jun16413'}")
    private String emailPassword;
    @Value("${email.support:zavzub@gmail.com}")
    private String emailSupport;

    //Spring variables
    @Value("spring.servlet.multipart.max-file-size")
    private String maxFileSize;
    @Value("spring.servlet.multipart.max-request-size")
    private String maxRequestSize;

    // DB Variables
    @Value("${db.defaultSchema:smartlist}")
    private String defaultSchema;
    @Value("${db.driverClass:com.microsoft.sqlserver.jdbc.SQLServerDriver}")
    private String driverClass;
    @Value("${db.dataSourceURL:jdbc:sqlserver://localhost:1480};encrypt=true;trustServerCertificate=true;")
    private String dataSourceURL;
    @Value("${db.userName:sa}")
    private String dbUserName;
    @Value("${db.password:lemmein}")
    private String dbPassword;

    // Hibernate variables
    @Value("${hibernate.dialect:org.hibernate.dialect.SQLServer2012Dialect}")
    private String hibernateDialect;
    @Value("${hibernate.show_sql:false}")
    private String showSql;
    @Value("${envers.enable:true}")
    private String enversEnabled;


    // Migration variables
    @Value("${flyway.enabled:true}")
    private boolean flywayEnabled;
    @Value("${flyway.baselineOnMigrate:true}")
    private boolean flywayBaselineOnMigrate;
    @Value("${flyway.readmelocation:null}")
    private String flywayReadmeLocation;

    //Security
    @Value("${jwt.secret:secret}")
    private String jwtSecret;

    //Misc
    @Value("${generate.mock.data:false}")
    private boolean generateMockData;

    private boolean devProfileActive = false;
    private boolean testProfileActive = false;
    private boolean prodProfileActive = false;


    @Autowired
    public PropertiesConfig() {
        super();
    }

    @PostConstruct
    public void postConstruct() {
        final List<String> activeProfiles = Arrays.asList(this.springEnvironment.getActiveProfiles());
        if (activeProfiles.stream().anyMatch(profile -> profile.equalsIgnoreCase(SpringProfile.DEV.toString()))) {
            this.devProfileActive = true;
        } else if (activeProfiles.stream().anyMatch(profile -> profile.equalsIgnoreCase(SpringProfile.TEST.toString()))) {
            this.testProfileActive = true;
        } else if (activeProfiles.stream().anyMatch(profile -> profile.equalsIgnoreCase(SpringProfile.DEFAULT.toString()))
                || activeProfiles.stream().anyMatch(profile -> profile.equalsIgnoreCase(SpringProfile.PROD.toString()))) {
            this.prodProfileActive = true;
        }
    }




}