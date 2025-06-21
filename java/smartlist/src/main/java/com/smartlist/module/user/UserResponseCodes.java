package com.smartlist.module.user;

import com.smartlist.utils.AppResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UserResponseCodes extends AppResponseCodes {

    private UserResponseCodes(){}

    public static final String USER_EMAIL_ID_EXISTS_DESCRIPTION = "user with email already exists";
    public static final String USER_EMAIL_ALREADY_VERIFIED_DESCRIPTION = "user email already verified";
    public static final String TOKEN_EXPIRED_DESCRIPTION = "token expired";
    public static final String INVALID_TOKEN_DESCRIPTION = "token invalid";
    public static final String INVALID_USER_ID_DESCRIPTION = "invalid user id";
    public static final String INVALID_PASSWORD_DESCRIPTION = "invalid user password";
    public static final String INVALID_USER_EMAIL_ID_DESCRIPTION = "invalid user email id";
    public static final String INVALID_ORGANIZATION_ID_DESCRIPTION = "invalid organization id";
    public static final String INVALID_PROFILE_PHOTO_FILE_DESCRIPTION = "invalid profile photo file id";


    public static ResponseStatusException USER_EMAIL_ID_EXISTS = new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_EMAIL_ID_EXISTS_DESCRIPTION);

    public static ResponseStatusException USER_EMAIL_ALREADY_VERIFIED = new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_EMAIL_ALREADY_VERIFIED_DESCRIPTION);

    public static ResponseStatusException TOKEN_EXPIRED = new ResponseStatusException(HttpStatus.BAD_REQUEST, TOKEN_EXPIRED_DESCRIPTION);

    public static ResponseStatusException INVALID_TOKEN = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_TOKEN_DESCRIPTION);

    public static ResponseStatusException INVALID_USER_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_USER_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_PASSWORD = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_PASSWORD_DESCRIPTION);

    public static ResponseStatusException INVALID_USER_EMAIL_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_USER_EMAIL_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ORGANIZATION_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ORGANIZATION_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_PROFILE_PHOTO_FILE_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_PROFILE_PHOTO_FILE_DESCRIPTION);

}
