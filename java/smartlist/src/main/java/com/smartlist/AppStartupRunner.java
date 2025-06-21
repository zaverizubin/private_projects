package com.smartlist;

import com.smartlist.config.PropertiesConfig;
import com.smartlist.services.DBMigrationService;
import com.smartlist.services.MockDataGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class AppStartupRunner implements ApplicationRunner {

    private final MockDataGeneratorService mockDataGeneratorService;
    private final DBMigrationService dbMigrationService;
    private final PropertiesConfig propertiesConfig;

    @Autowired
    public AppStartupRunner(final MockDataGeneratorService mockDataGeneratorService, final DBMigrationService dbMigrationService,
                            final PropertiesConfig propertiesConfig){
        this.mockDataGeneratorService = mockDataGeneratorService;
        this.dbMigrationService = dbMigrationService;
        this.propertiesConfig = propertiesConfig;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if(this.dbMigrationService.isMigrationRequired()){
            this.dbMigrationService.migrateDB();
        }
        if(this.propertiesConfig.isGenerateMockData()){
            this.mockDataGeneratorService.clearAllData();
            this.mockDataGeneratorService.constructData();
        }

    }
}

