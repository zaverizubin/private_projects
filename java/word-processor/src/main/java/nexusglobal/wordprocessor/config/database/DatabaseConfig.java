package nexusglobal.wordprocessor.config.database;


import nexusglobal.wordprocessor.config.PropertiesConfig;
import nexusglobal.wordprocessor.config.database.audit.CustomRevisionListener;
import org.flywaydb.core.Flyway;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.envers.configuration.EnversSettings;
import org.hibernate.envers.strategy.internal.ValidityAuditStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
public class DatabaseConfig {

    private final PropertiesConfig propertiesConfig;


    public DatabaseConfig(PropertiesConfig propertiesConfig) {
        this.propertiesConfig = propertiesConfig;
    }

    private Properties additionalProperties() {
        final Properties properties = new Properties();

        // Hibernate
        properties.setProperty(AvailableSettings.USE_NATIONALIZED_CHARACTER_DATA, Boolean.TRUE.toString());
        properties.setProperty(AvailableSettings.DIALECT, this.propertiesConfig.getHibernateDialect());
        properties.setProperty(AvailableSettings.USE_NEW_ID_GENERATOR_MAPPINGS, Boolean.FALSE.toString());
        properties.setProperty(AvailableSettings.IMPLICIT_NAMING_STRATEGY, CustomImplicitNamingStrategy.class.getName());
        properties.setProperty(AvailableSettings.PHYSICAL_NAMING_STRATEGY, CustomPhysicalNamingStrategy.class.getName());
        properties.setProperty(AvailableSettings.SHOW_SQL, this.propertiesConfig.getShowSql());
        properties.setProperty(AvailableSettings.FORMAT_SQL, Boolean.TRUE.toString());
        properties.setProperty(AvailableSettings.DEFAULT_BATCH_FETCH_SIZE, "50");

        // Auditing (Envers)
        properties.setProperty("hibernate.listeners.envers.autoRegister", this.propertiesConfig.getEnversEnabled());
        properties.setProperty(EnversSettings.AUDIT_STRATEGY, ValidityAuditStrategy.class.getName());
        properties.setProperty(EnversSettings.TRACK_ENTITIES_CHANGED_IN_REVISION, Boolean.TRUE.toString());
        properties.setProperty(EnversSettings.REVISION_LISTENER, CustomRevisionListener.class.getName());
        properties.setProperty(EnversSettings.DO_NOT_AUDIT_OPTIMISTIC_LOCKING_FIELD, Boolean.FALSE.toString());

        return properties;
    }

    @Bean
    @DependsOn("dataSource")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(final DataSource dataSource) {
        final LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();

        em.setDataSource(dataSource);
        em.setPackagesToScan("nexusglobal.controlpanel.model.entities", "nexusglobal.controlpanel.config.database.audit");

        final JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        em.setJpaProperties(additionalProperties());

        return em;
    }

    @Bean
    public DataSource dataSource() {
        final DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(this.propertiesConfig.getDriverClass());
        dataSource.setUrl(this.propertiesConfig.getDataSourceURL() + ";databaseName=" + this.propertiesConfig.getDefaultSchema());
        dataSource.setUsername(this.propertiesConfig.getDbUserName());
        dataSource.setPassword(this.propertiesConfig.getDbPassword());
        return dataSource;
    }

    @Bean
    @DependsOn("dataSource")
    public Flyway flyway(final DataSource dataSource) {
        return Flyway.configure()
                .baselineOnMigrate(this.propertiesConfig.getFlywayBaselineOnMigrate())
                .baselineVersion("1.0.0")
                .dataSource(dataSource)
                .validateOnMigrate(false)
                .load();

    }

}