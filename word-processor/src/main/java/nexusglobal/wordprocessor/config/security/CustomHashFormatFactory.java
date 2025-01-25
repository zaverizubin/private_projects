package nexusglobal.wordprocessor.config.security;

import org.apache.shiro.crypto.hash.format.DefaultHashFormatFactory;

public class CustomHashFormatFactory extends DefaultHashFormatFactory {

    @Override
    protected Class<?> getHashFormatClass(final String token) {

        Class<?> clazz = null;
        if (Nexus1CryptFormat.ID.equals(token)) {
            clazz = Nexus1CryptFormat.class;
        } else {
            clazz = super.getHashFormatClass(token);
        }

        return clazz;
    }
}