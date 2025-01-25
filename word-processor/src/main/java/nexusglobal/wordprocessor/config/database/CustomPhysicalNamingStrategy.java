package nexusglobal.wordprocessor.config.database;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategy;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

public class CustomPhysicalNamingStrategy implements PhysicalNamingStrategy {

    private Identifier convertToSnakeCase(final Identifier identifier) {
        if ((identifier == null) || StringUtils.isBlank(identifier.getText())) {
            return identifier;
        }

        final String regex = "([a-z])([A-Z])";
        final String replacement = "$1_$2";
        final String newName = identifier.getText().replaceAll(regex, replacement).toLowerCase();
        return Identifier.toIdentifier(newName);
    }

    @Override
    public Identifier toPhysicalCatalogName(final Identifier identifier, final JdbcEnvironment jdbcEnv) {
        return convertToSnakeCase(identifier);
    }

    @Override
    public Identifier toPhysicalSchemaName(final Identifier identifier, final JdbcEnvironment jdbcEnv) {
        return convertToSnakeCase(identifier);
    }

    @Override
    public Identifier toPhysicalTableName(final Identifier identifier, final JdbcEnvironment jdbcEnv) {
        if (identifier.isQuoted()) {
            return identifier;
        } else if (identifier.getText().equalsIgnoreCase("revchanges")) {
            return Identifier.toIdentifier("apm_rev_changes");
        } else {
            return convertToSnakeCase(identifier);
        }
    }

    @Override
    public Identifier toPhysicalSequenceName(final Identifier identifier, final JdbcEnvironment jdbcEnv) {
        return convertToSnakeCase(identifier);
    }

    @Override
    public Identifier toPhysicalColumnName(final Identifier identifier, final JdbcEnvironment jdbcEnv) {
        if (identifier.isQuoted()) {
            return identifier;
        } else {
            return convertToSnakeCase(identifier);
        }
    }

}
