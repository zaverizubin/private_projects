package com.smartlist.module.auth;

import com.smartlist.utils.AppResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AuthResponseCodes extends AppResponseCodes {

    private AuthResponseCodes(){}

    public static final String USER_CREDENTIALS_INVALID_DESCRIPTION = "user credentials are invalid";
    public static final String USER_ACCOUNT_INACTIVE_DESCRIPTION = "user account is inactive";
    public static final String USER_ACCOUNT_INVALID_DESCRIPTION = "invalid user account";
    public static final String ACCESS_TOKEN_INVALID_DESCRIPTION = "invalid access token";


    public static ResponseStatusException USER_CREDENTIALS_INVALID = new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_CREDENTIALS_INVALID_DESCRIPTION);

    public static ResponseStatusException USER_ACCOUNT_INACTIVE = new ResponseStatusException(HttpStatus.FORBIDDEN, USER_ACCOUNT_INACTIVE_DESCRIPTION);

    public static ResponseStatusException USER_ACCOUNT_INVALID = new ResponseStatusException(HttpStatus.NOT_FOUND, USER_ACCOUNT_INVALID_DESCRIPTION);

    public static ResponseStatusException ACCESS_TOKEN_INVALID = new ResponseStatusException(HttpStatus.UNAUTHORIZED, ACCESS_TOKEN_INVALID_DESCRIPTION);



}
