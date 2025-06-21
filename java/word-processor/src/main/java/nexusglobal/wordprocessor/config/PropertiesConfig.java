package nexusglobal.wordprocessor.config;

import nexusglobal.wordprocessor.enums.SpringProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class PropertiesConfig {

    public static final String SUPPORT_EMAIL_ADDRESS = "support@nexusglobal.com";
    public static final String COPYRIGHT = "Copyright {0} Nexus Global Business Solutions, Inc. All rights reserved.";

    private List<String> activeProfiles;

    // Autowired Components
    @Autowired
    private Environment configurableEnvironment;
    @Autowired
    private Environment springEnvironment;

    // DB Variables
    @Value("${db.defaultSchema:}")
    private String defaultSchema;
    @Value("${db.driverClass:com.microsoft.sqlserver.jdbc.SQLServerDriver}")
    private String driverClass;
    @Value("${db.dataSourceURL:jdbc:sqlserver://localhost}")
    private String dataSourceURL;
    @Value("${db.userName:}")
    private String dbUserName;
    @Value("${db.password:}")
    private String dbPassword;

    // Hibernate variables
    @Value("${hibernate.dialect:org.hibernate.dialect.SQLServer2012Dialect}")
    private String hibernateDialect;
    @Value("${hibernate.show_sql:false}")
    private String showSql;
    @Value("${envers.enable:true}")
    private String enversEnabled;

    //Email Variables
    @Value("${emailHost:smtp.office365.com}")
    private String emailHost;
    @Value("${emailPort:587}")
    private Integer emailPort;
    @Value("${supportEmail:software-support@nexusglobal.com}")
    private String supportEmail;
    @Value("${supportEmailPassword:Jun16413}")
    private String supportEmailPassword;

    // Migration variables
    @Value("${flyway.enabled:true}")
    private boolean flywayEnabled;
    @Value("${flyway.baselineOnMigrate:false}")
    private boolean flywayBaselineOnMigrate;
    @Value("${flyway.readmelocation:null}")
    private String flywayReadmeLocation;
    @Value("${spring.profiles.active:dev}")
    private SpringProfile activeProfile;

    // Provisioning DB variables
    @Value("${apmSuiteDataSourceURL:jdbc:sqlserver://localhost;encrypt=true;trustServerCertificate=true;}")
    private String apmSuiteDataSourceURL;
    @Value("${apmSuiteDBUserName:sa}")
    private String apmSuiteDBUserName;
    @Value("${apmSuiteDBPassword:lemmein}")
    private String apmSuiteDBPassword;
    @Value("${apmSuiteResetPasswordURLFragment:home/password/reset}")
    private String apmSuiteResetPasswordURLFragment;

    // Provisioning APM suite variables
    @Value("${apmSuiteDefaultSchema:nexus}")
    private String apmSuiteDefaultSchema;
    @Value("${apmSuiteDefaultSchemaURL:https://localhost/apm}")
    private String apmSuiteDefaultSchemaURL;

    @Value("${apmSuiteUsername:adminNexus@admin.com}")
    private String apmSuiteUsername;
    @Value("${apmSuitePassword:testing123}")
    private String apmSuitePassword;


    @Autowired
    public PropertiesConfig() {
        super();
    }


    public String getDefaultSchema() {
        return this.defaultSchema;
    }

    public String getHibernateDialect() {
        return this.hibernateDialect;
    }

    public String getShowSql() {
        return this.showSql;
    }

    public String getEnversEnabled() {
        return this.enversEnabled;
    }

    public String getEmailHost() {
        return this.emailHost;
    }

    public Integer getEmailPort() {
        return this.emailPort;
    }

    public String getSupportEmailPassword() {
        return this.supportEmailPassword;
    }

    public String getSupportEmail() {
        return this.supportEmail;
    }

    public String getDriverClass() {
        return this.driverClass;
    }

    public String getDataSourceURL() {
        return this.dataSourceURL;
    }

    public String getDbUserName() {
        return this.dbUserName;
    }

    public String getDbPassword() {
        return this.dbPassword;
    }

    public boolean getFlywayEnabled() {
        return this.flywayEnabled;
    }

    public boolean getFlywayBaselineOnMigrate() {
        return this.flywayBaselineOnMigrate;
    }

    public String getFlywayReadmeLocation() {
        return this.flywayReadmeLocation;
    }

    public SpringProfile getActiveProfile() {
        return this.activeProfile;
    }

    public String getAPMSuiteDataSourceURL() {
        return this.apmSuiteDataSourceURL;
    }

    public String getAPMSuiteDBUserName() {
        return this.apmSuiteDBUserName;
    }

    public String getAPMSuiteDBPassword() {
        return this.apmSuiteDBPassword;
    }

    public String getAPMSuiteDefaultSchema() {
        return this.apmSuiteDefaultSchema;
    }

    public String getAPMSuiteDefaultSchemaURL() {
        return this.apmSuiteDefaultSchemaURL;
    }

    public String getAPMSuiteUsername() {
        return this.apmSuiteUsername;
    }

    public String getAPMSuitePassword() {
        return this.apmSuitePassword;
    }

    public String getApmSuiteResetPasswordURLFragment(){
        return this.apmSuiteResetPasswordURLFragment;
    }

    public boolean hasDevProfile() {
        return getActiveProfiles().contains(SpringProfile.DEV.toString().toLowerCase());
    }

    private List<String> getActiveProfiles() {
        if (this.activeProfiles == null) {
            this.activeProfiles = Arrays.asList(this.springEnvironment.getActiveProfiles());
        }
        return this.activeProfiles;
    }

}
