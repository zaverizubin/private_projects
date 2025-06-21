package com.smartlist.module.candidate;

import com.smartlist.utils.AppResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CandidateResponseCodes extends AppResponseCodes {


    private CandidateResponseCodes(){}

    public static final String CANDIDATE_EXISTS_DESCRIPTION = "candidate exists";
    public static final String CANDIDATE_EMAIL_EXISTS_DESCRIPTION = "candidate email exists";
    public static final String CANDIDATE_ALREADY_VERIFIED_DESCRIPTION = "candidate already verified";
    public static final String CANDIDATE_ASSESSMENT_EXISTS_DESCRIPTION = "candidate assessment exists";
    public static final String ASSESSMENT_ACTION_DENIED_DESCRIPTION = "action invalid for assessment state";
    public static final String CANDIDATE_ASSESSMENT_NOT_FOUND_DESCRIPTION = "candidate assessment not found";
    public static final String CANDIDATE_ASSESSMENT_ACTION_DENIED_DESCRIPTION = "action invalid for candidate assessment state";
    public static final String ASSESSMENT_BLOCK_QUESTION_MISMATCH_DESCRIPTION = "question not from active assessment block";
    public static final String CANDIDATE_ASSESSMENT_TIMED_OUT_DESCRIPTION = "candidate assessment timed out";
    public static final String ANSWER_RESPONSE_INCORRECT_DESCRIPTION = "incorrect answer response";
    public static final String INVALID_FILE_TYPE_DESCRIPTION = "invalid file type";
    public static final String INVALID_ORGANIZATION_ID_DESCRIPTION = "invalid organization id";
    public static final String INVALID_CANDIDATE_ID_DESCRIPTION = "invalid candidate id";
    public static final String INVALID_ASSESSMENT_ID_DESCRIPTION = "invalid assessment id";
    public static final String INVALID_CANDIDATE_CONTACT_NUMBER_DESCRIPTION = "invalid candidate contact number";
    public static final String INVALID_VERIFICATION_CODE_DESCRIPTION = "invalid candidate verification code";
    public static final String INVALID_ASSESSMENT_TOKEN_DESCRIPTION = "invalid assessment token";
    public static final String CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS_DESCRIPTION = "candidate assessment does not exists";
    public static final String INVALID_CANDIDATE_ASSESSMENT_ID_DESCRIPTION = "invalid candidate assessment id";
    public static final String INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION = "invalid assessment block id";
    public static final String INVALID_QUESTION_ID_DESCRIPTION = "invalid question id";
    public static final String INVALID_ANSWER_ID_DESCRIPTION = "invalid answer id(s)";
    public static final String INVALID_PHOTO_FILE_ID_DESCRIPTION = "invalid photo file id";
    public static final String INVALID_VIDEO_FILE_ID_DESCRIPTION = "invalid video file id";
    public static final String INVALID_FILE_ID_DESCRIPTION = "invalid file id";


    public static ResponseStatusException CANDIDATE_EXISTS = new ResponseStatusException(HttpStatus.BAD_REQUEST, CANDIDATE_EXISTS_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_EMAIL_EXISTS = new ResponseStatusException(HttpStatus.BAD_REQUEST, CANDIDATE_EMAIL_EXISTS_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_ALREADY_VERIFIED = new ResponseStatusException(HttpStatus.BAD_REQUEST, CANDIDATE_ALREADY_VERIFIED_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_ASSESSMENT_EXISTS = new ResponseStatusException(HttpStatus.BAD_REQUEST, CANDIDATE_ASSESSMENT_EXISTS_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_ASSESSMENT_NOT_FOUND = new ResponseStatusException(HttpStatus.NOT_FOUND, CANDIDATE_ASSESSMENT_NOT_FOUND_DESCRIPTION);

    public static ResponseStatusException ASSESSMENT_ACTION_DENIED = new ResponseStatusException(HttpStatus.BAD_REQUEST, ASSESSMENT_ACTION_DENIED_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_ASSESSMENT_ACTION_DENIED = new ResponseStatusException(HttpStatus.BAD_REQUEST, CANDIDATE_ASSESSMENT_ACTION_DENIED_DESCRIPTION);

    public static ResponseStatusException ASSESSMENT_BLOCK_QUESTION_MISMATCH = new ResponseStatusException(HttpStatus.BAD_REQUEST, ASSESSMENT_BLOCK_QUESTION_MISMATCH_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_ASSESSMENT_TIMED_OUT = new ResponseStatusException(HttpStatus.BAD_REQUEST, CANDIDATE_ASSESSMENT_TIMED_OUT_DESCRIPTION);

    public static ResponseStatusException ANSWER_RESPONSE_INCORRECT = new ResponseStatusException(HttpStatus.BAD_REQUEST, ANSWER_RESPONSE_INCORRECT_DESCRIPTION);

    public static ResponseStatusException INVALID_FILE_TYPE = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_FILE_TYPE_DESCRIPTION);

    public static ResponseStatusException INVALID_ORGANIZATION_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ORGANIZATION_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_CANDIDATE_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_CANDIDATE_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_CANDIDATE_CONTACT_NUMBER = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_CANDIDATE_CONTACT_NUMBER_DESCRIPTION);

    public static ResponseStatusException INVALID_VERIFICATION_CODE = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_VERIFICATION_CODE_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_TOKEN = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_TOKEN_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS = new ResponseStatusException(HttpStatus.NOT_FOUND, CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS_DESCRIPTION);

    public static ResponseStatusException INVALID_CANDIDATE_ASSESSMENT_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_CANDIDATE_ASSESSMENT_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_BLOCK_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_QUESTION_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_QUESTION_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ANSWER_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ANSWER_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_PHOTO_FILE_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_PHOTO_FILE_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_VIDEO_FILE_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_VIDEO_FILE_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_FILE_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_FILE_ID_DESCRIPTION);







}
