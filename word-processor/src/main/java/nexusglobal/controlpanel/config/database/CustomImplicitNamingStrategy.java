package nexusglobal.controlpanel.config.database;

import nexusglobal.controlpanel.interfaces.Loggable;
import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.ImplicitForeignKeyNameSource;
import org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl;
import org.hibernate.boot.model.naming.ImplicitUniqueKeyNameSource;

public class CustomImplicitNamingStrategy extends ImplicitNamingStrategyJpaCompliantImpl implements Loggable {

    @Override
    public Identifier determineForeignKeyName(final ImplicitForeignKeyNameSource source) {
        final Identifier userProvidedIdentifier = source.getUserProvidedIdentifier();

        Identifier result;
        if (userProvidedIdentifier != null) {
            result = userProvidedIdentifier;
        } else {
            final StringBuilder builder = new StringBuilder();
            builder.append("FK_").append(source.getTableName().getText());
            for (final Identifier columnName : source.getColumnNames()) {
                builder.append("_").append(columnName.getText());
            }
            builder.append("__").append(source.getReferencedTableName().getText());

            result = toIdentifier(builder.toString(), source.getBuildingContext());
        }

        return result;
    }

    @Override
    public Identifier determineUniqueKeyName(final ImplicitUniqueKeyNameSource source) {

        final Identifier userProvidedIdentifier = source.getUserProvidedIdentifier();

        Identifier result;
        if (userProvidedIdentifier != null) {
            result = userProvidedIdentifier;
        } else {
            final StringBuilder builder = new StringBuilder();
            builder.append("UK_").append(source.getTableName().getText());
            for (final Identifier columnName : source.getColumnNames()) {
                builder.append("_").append(columnName.getText());
            }

            result = toIdentifier(builder.toString(), source.getBuildingContext());
        }
        return result;
    }

}
