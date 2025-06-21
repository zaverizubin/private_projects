package com.smartlist.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexPatterns {

    public static final String PASSWORD = "((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$";

    public static final String ALLOWED_IMAGE_FILE_EXTENSIONS = "image/jpg||image/jpeg||image/png||image/gif";

    public static final String ALLOWED_VIDEO_FILE_EXTENSIONS = "video/x-ms-wmv||video/quicktime||video/x-msvideo||video/flv||video/mp4||video/m3u8||video/mov||video/avi||video/wmv||video/3gp||video/mkv||video/webm||video/video";

    public static final String ALLOWED_FILE_EXTENSIONS = "application/pdf||application/msword||application/txt||application/vnd.openxmlformats-officedocument.wordprocessingml.document||application/plain||application/vnd.ms-powerpoint||application/vnd.openxmlformats-officedocument.presentationml.pr||application/vnd.ms-excel||application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";


    public static boolean isMatch(String input, String pattern){
        Pattern p = Pattern.compile(pattern);
        Matcher m = p.matcher(input);
        return m.matches();
    }
}
