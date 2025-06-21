package com.smartlist.module.assessment;

import com.smartlist.utils.AppResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AssessmentResponseCodes extends AppResponseCodes {

    private AssessmentResponseCodes(){}

    public static final String ASSESSMENT_NAME_EXISTS_DESCRIPTION = "Assessment with same name exists";
    public static final String ASSESSMENT_ACTION_DENIED_DESCRIPTION = "Action invalid for assessment state";
    public static final String INVALID_ASSESSMENT_STATUS_DESCRIPTION = "Assessment status invalid";
    public static final String INVALID_ASSESSMENT_BLOCK_COUNT_DESCRIPTION = "Assessment Block count must be > 0";
    public static final String INVALID_QUESTION_COUNT_DESCRIPTION = "Assessment Block Question count must be > 0";
    public static final String INVALID_ASSESSMENT_ID_DESCRIPTION = "Assessment Id invalid";
    public static final String INVALID_ASSESSMENT_TOKEN_DESCRIPTION = "Assessment token invalid";
    public static final String INVALID_HEADER_FILE_ID_DESCRIPTION = "Header file id invalid";
    public static final String INVALID_ORGANIZATION_ID_DESCRIPTION = "Organization id invalid";


    public static ResponseStatusException ASSESSMENT_NAME_EXISTS = new ResponseStatusException(HttpStatus.BAD_REQUEST, ASSESSMENT_NAME_EXISTS_DESCRIPTION);

    public static ResponseStatusException ASSESSMENT_ACTION_DENIED = new ResponseStatusException(HttpStatus.BAD_REQUEST, ASSESSMENT_ACTION_DENIED_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_STATUS = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_ASSESSMENT_STATUS_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_BLOCK_COUNT = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_ASSESSMENT_BLOCK_COUNT_DESCRIPTION);

    public static ResponseStatusException INVALID_QUESTION_COUNT = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_QUESTION_COUNT_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_TOKEN = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_TOKEN_DESCRIPTION);

    public static ResponseStatusException INVALID_HEADER_FILE_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_HEADER_FILE_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ORGANIZATION_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ORGANIZATION_ID_DESCRIPTION);

}
