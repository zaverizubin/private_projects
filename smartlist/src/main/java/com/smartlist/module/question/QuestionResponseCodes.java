package com.smartlist.module.question;

import com.smartlist.utils.AppResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class QuestionResponseCodes extends AppResponseCodes {

    private QuestionResponseCodes(){}

    public static final String ASSESSMENT_ACTION_DENIED_DESCRIPTION = "action invalid for assessment state";
    public static final String INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION = "invalid assessment block id";
    public static final String INVALID_QUESTION_TYPE_DESCRIPTION = "invalid question type";
    public static final String INVALID_QUESTION_ID_LIST_DESCRIPTION = "invalid question id list";
    public static final String INVALID_ANSWER_OPTIONS_FOR_QUESTION_TYPE_DESCRIPTION = "invalid answer options for question type";
    public static final String INVALID_SCORE_DESCRIPTION = "invalid answer options score for question type";
    public static final String INVALID_ANSWER_OPTION_DESCRIPTION = "invalid correct answer option(s) for question type";
    public static final String INVALID_ANSWER_TEXT_DESCRIPTION = "invalid answer text for question type";
    public static final String INVALID_QUESTION_OPTION_DESCRIPTION = "invalid question option(s) for question type";
    public static final String INVALID_QUESTION_ID_DESCRIPTION = "invalid question id";


    public static ResponseStatusException ASSESSMENT_ACTION_DENIED = new ResponseStatusException(HttpStatus.BAD_REQUEST, ASSESSMENT_ACTION_DENIED_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_BLOCK_ID = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_QUESTION_TYPE = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_QUESTION_TYPE_DESCRIPTION);

    public static ResponseStatusException INVALID_QUESTION_ID_LIST = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_QUESTION_ID_LIST_DESCRIPTION);

    public static ResponseStatusException INVALID_ANSWER_OPTIONS_FOR_QUESTION_TYPE = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_ANSWER_OPTIONS_FOR_QUESTION_TYPE_DESCRIPTION);

    public static ResponseStatusException INVALID_SCORE = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_SCORE_DESCRIPTION);

    public static ResponseStatusException INVALID_ANSWER_OPTION = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_ANSWER_OPTION_DESCRIPTION);

    public static ResponseStatusException INVALID_ANSWER_TEXT = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_ANSWER_TEXT_DESCRIPTION);

    public static ResponseStatusException INVALID_QUESTION_OPTION = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_QUESTION_OPTION_DESCRIPTION);

    public static ResponseStatusException INVALID_QUESTION_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_QUESTION_ID_DESCRIPTION);



}
