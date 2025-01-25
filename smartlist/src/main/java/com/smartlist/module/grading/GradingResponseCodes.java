package com.smartlist.module.grading;

import com.smartlist.utils.AppResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class GradingResponseCodes extends AppResponseCodes {

    private GradingResponseCodes(){}

    public static final String ASSESSMENT_ACTION_DENIED_DESCRIPTION = "action invalid for assessment state";
    public static final String INVALID_ASSESSMENT_DECISION_DESCRIPTION = "invalid assessment decision";
    public static final String CANDIDATE_ASSESSMENT_ACTION_DENIED_DESCRIPTION = "action invalid for candidate assessment state";
    public static final String CANDIDATE_ASSESSMENT_SCORING_PENDING_DESCRIPTION = "all questions are required to be scored";
    public static final String CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS_DESCRIPTION = "candidate assessment does not exists";
    public static final String INVALID_CANDIDATE_ID_DESCRIPTION = "invalid candidate id";
    public static final String INVALID_ASSESSMENT_ID_DESCRIPTION = "invalid assessment id";
    public static final String INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION = "invalid assessment block id";
    public static final String INVALID_QUESTION_ID_DESCRIPTION = "invalid question id";
    public static final String INVALID_CANDIDATE_ASSESSMENT_ID_DESCRIPTION = "invalid candidate assessment id";


    public static ResponseStatusException ASSESSMENT_ACTION_DENIED = new ResponseStatusException(HttpStatus.BAD_REQUEST, ASSESSMENT_ACTION_DENIED_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_DECISION = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_ASSESSMENT_DECISION_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_ASSESSMENT_ACTION_DENIED = new ResponseStatusException(HttpStatus.BAD_REQUEST, CANDIDATE_ASSESSMENT_ACTION_DENIED_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_ASSESSMENT_SCORING_PENDING = new ResponseStatusException(HttpStatus.NOT_FOUND, CANDIDATE_ASSESSMENT_SCORING_PENDING_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS = new ResponseStatusException(HttpStatus.NOT_FOUND, CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS_DESCRIPTION);

    public static ResponseStatusException INVALID_CANDIDATE_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_CANDIDATE_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_BLOCK_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_QUESTION_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_QUESTION_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_CANDIDATE_ASSESSMENT_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_CANDIDATE_ASSESSMENT_ID_DESCRIPTION);

}
