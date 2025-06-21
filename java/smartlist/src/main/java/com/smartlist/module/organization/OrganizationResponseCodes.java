package com.smartlist.module.organization;

import com.smartlist.utils.AppResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class OrganizationResponseCodes extends AppResponseCodes {

    private OrganizationResponseCodes(){}

    public static final String ORGANIZATION_NAME_EXISTS_DESCRIPTION = "organization with same name exists";
    public static final String INVALID_ORGANIZATION_ID_DESCRIPTION = "invalid organization id";
    public static final String INVALID_USER_EMAIL_ID_DESCRIPTION = "invalid user email id";
    public static final String INVALID_USER_ID_DESCRIPTION = "invalid user id";
    public static final String INVALID_LOGO_FILE_ID_DESCRIPTION = "invalid logo file id";


    public static ResponseStatusException ORGANIZATION_NAME_EXISTS = new ResponseStatusException(HttpStatus.BAD_REQUEST, ORGANIZATION_NAME_EXISTS_DESCRIPTION);

    public static ResponseStatusException INVALID_ORGANIZATION_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ORGANIZATION_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_USER_EMAIL_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_USER_EMAIL_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_USER_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_USER_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_LOGO_FILE_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_LOGO_FILE_ID_DESCRIPTION);



}
