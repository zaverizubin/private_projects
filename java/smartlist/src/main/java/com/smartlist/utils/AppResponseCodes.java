package com.smartlist.utils;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.security.NoSuchAlgorithmException;

public class AppResponseCodes {

    public static final String BAD_REQUEST_DESCRIPTION = "Bad request";

    public static final String INTERNAL_SERVER_ERROR_DESCRIPTION = "Internal server error";

    private static final String UNAUTHORIZED_REQUEST_DESCRIPTION = "UnAuthorised";

    public static final ResponseStatusException UNAUTHORISED = new ResponseStatusException(HttpStatus.UNAUTHORIZED, UNAUTHORIZED_REQUEST_DESCRIPTION);

    public static final ResponseStatusException BAD_REQUEST = new ResponseStatusException(HttpStatus.BAD_REQUEST, BAD_REQUEST_DESCRIPTION);

    public static final ResponseStatusException INTERNAL_SERVER_ERROR = new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_DESCRIPTION);

}
