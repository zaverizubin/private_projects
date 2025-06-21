package com.smartlist.module.assessmentblock;

import com.smartlist.utils.AppResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AssessmentBlockResponseCodes extends AppResponseCodes {

    private AssessmentBlockResponseCodes(){}

    public static final String ASSESSMENT_ACTION_DENIED_DESCRIPTION = "action invalid for assessment state";
    public static final String ASSESSMENT_BLOCK_ACTION_DENIED_DESCRIPTION = "action invalid for assessment block state";
    public static final String INVALID_ASSESSMENT_ID_DESCRIPTION = "invalid assessment id";
    public static final String INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION = "invalid assessment block id";
    public static final String INVALID_ASSESSMENT_BLOCK_ID_LIST_DESCRIPTION = "invalid assessment block id list";
    public static final String INVALID_QUESTION_ID_DESCRIPTION = "invalid question id";
    public static final String INVALID_QUESTION_TYPE_DESCRIPTION = "invalid question type";

    public static ResponseStatusException ASSESSMENT_ACTION_DENIED = new ResponseStatusException(HttpStatus.BAD_REQUEST, ASSESSMENT_ACTION_DENIED_DESCRIPTION);

    public static ResponseStatusException ASSESSMENT_BLOCK_ACTION_DENIED = new ResponseStatusException(HttpStatus.BAD_REQUEST, ASSESSMENT_BLOCK_ACTION_DENIED_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_BLOCK_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_BLOCK_ID_LIST = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_BLOCK_ID_LIST_DESCRIPTION);

    public static ResponseStatusException INVALID_QUESTION_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_QUESTION_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_QUESTION_TYPE = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_QUESTION_TYPE_DESCRIPTION);


}
