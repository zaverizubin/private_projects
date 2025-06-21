package com.smartlist.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
@EnableJpaRepositories(basePackages = "com.smartlist.module")
public class DatabaseConfig {

    private final PropertiesConfig propertiesConfig;

    public DatabaseConfig(PropertiesConfig propertiesConfig) {
        this.propertiesConfig = propertiesConfig;
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
                .baselineOnMigrate(this.propertiesConfig.isFlywayBaselineOnMigrate())
                .baselineVersion("1.0.0")
                .dataSource(dataSource)
                .validateOnMigrate(false)
                .load();

    }


}
