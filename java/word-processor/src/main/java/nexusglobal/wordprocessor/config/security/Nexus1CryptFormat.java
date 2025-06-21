package nexusglobal.wordprocessor.config.security;

import org.apache.shiro.codec.Base64;
import org.apache.shiro.crypto.hash.Hash;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.crypto.hash.format.ModularCryptFormat;
import org.apache.shiro.crypto.hash.format.ParsableHashFormat;
import org.apache.shiro.util.ByteSource;
import org.apache.shiro.util.StringUtils;

public class Nexus1CryptFormat implements ModularCryptFormat, ParsableHashFormat {

    public static final String ID = "nexus1";
    public static final String MCF_PREFIX = TOKEN_DELIMITER + ID + TOKEN_DELIMITER;

    public Nexus1CryptFormat() {
        super();
    }

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public String format(final Hash hash) {
        if (hash == null) {
            return null;
        }

        final String algorithmName = hash.getAlgorithmName();
        final ByteSource salt = hash.getSalt();
        final int iterations = hash.getIterations();
        final StringBuilder sb = new StringBuilder(MCF_PREFIX).append(algorithmName).append(TOKEN_DELIMITER).append(iterations).append(TOKEN_DELIMITER);

        if (salt != null) {
            sb.append(salt.toBase64());
        }

        sb.append(TOKEN_DELIMITER);
        sb.append(hash.toBase64());

        return sb.toString();
    }

    @Override
    public Hash parse(final String formatted) {
        if (formatted == null) {
            return null;
        }
        if (!formatted.startsWith(MCF_PREFIX) && !formatted.startsWith("shiro1")) {
            final String msg = "The argument is not a valid '" + ID + "' formatted hash.";
            throw new IllegalArgumentException(msg);
        }

        final String suffix = formatted.substring(MCF_PREFIX.length());
        final String[] parts = suffix.split("\\$");

        // last part is always the digest/checksum, Base64-encoded:
        int i = parts.length - 1;
        final String digestBase64 = parts[i--];
        // second-to-last part is always the salt, Base64-encoded:
        final String saltBase64 = parts[i--];
        final String iterationsString = parts[i--];
        final String algorithmName = parts[i];

        final byte[] digest = Base64.decode(digestBase64);
        ByteSource salt = null;

        if (StringUtils.hasLength(saltBase64)) {
            final byte[] saltBytes = Base64.decode(saltBase64);
            salt = ByteSource.Util.bytes(saltBytes);
        }

        int iterations;
        try {
            iterations = Integer.parseInt(iterationsString);
        } catch (final NumberFormatException e) {
            final String msg = "Unable to parse formatted hash string: " + formatted;
            throw new IllegalArgumentException(msg, e);
        }

        final SimpleHash hash = new SimpleHash(algorithmName);
        hash.setBytes(digest);
        if (salt != null) {
            hash.setSalt(salt);
        }
        hash.setIterations(iterations);

        return hash;
    }

}
