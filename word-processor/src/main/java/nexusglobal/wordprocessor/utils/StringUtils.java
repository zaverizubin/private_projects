package nexusglobal.wordprocessor.utils;

public final class StringUtils {

    private StringUtils() {
        super();
    }

    public static String removeAllSpecialCharacters(String string) {
        return string.replaceAll("[^a-zA-Z0-9_-]", "");
    }
}
