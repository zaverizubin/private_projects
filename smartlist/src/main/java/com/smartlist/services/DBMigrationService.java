package com.smartlist.services;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.FlywayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DBMigrationService {
    private final Flyway flyway;

    @Autowired
    public DBMigrationService(final Flyway flyway) {
        super();
        this.flyway = flyway;
    }


    public boolean isMigrationRequired() throws FlywayException {
        return this.flyway.info().pending().length > 0;
    }

    public void migrateDB() throws FlywayException {
        this.flyway.migrate();
    }

}
