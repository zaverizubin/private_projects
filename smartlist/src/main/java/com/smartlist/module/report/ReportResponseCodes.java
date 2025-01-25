package com.smartlist.module.report;

import com.smartlist.utils.AppResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class ReportResponseCodes extends AppResponseCodes {

    private ReportResponseCodes(){}

    public static final String INVALID_DATE_DESCRIPTION = "invalid date";
    public static final String INVALID_ASSESSMENT_STATUS_DESCRIPTION = "invalid assessment status";
    public static final String INVALID_CANDIDATE_ID_DESCRIPTION = "invalid candidate id";
    public static final String INVALID_ORGANIZATION_ID_DESCRIPTION = "invalid organization id";
    public static final String INVALID_ASSESSMENT_ID_DESCRIPTION = "invalid assessment id";
    public static final String INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION = "invalid assessment block id";
    public static final String CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS_DESCRIPTION = "candidate assessment does not exists";

    public static ResponseStatusException INVALID_DATE = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_DATE_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_STATUS = new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_ASSESSMENT_STATUS_DESCRIPTION);

    public static ResponseStatusException INVALID_CANDIDATE_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_CANDIDATE_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ORGANIZATION_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ORGANIZATION_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_ID_DESCRIPTION);

    public static ResponseStatusException INVALID_ASSESSMENT_BLOCK_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION);

    public static ResponseStatusException CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS = new ResponseStatusException(HttpStatus.NOT_FOUND, CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS_DESCRIPTION);




}
