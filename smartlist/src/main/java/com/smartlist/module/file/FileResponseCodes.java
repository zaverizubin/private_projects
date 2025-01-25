package com.smartlist.module.file;

import com.smartlist.utils.AppResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FileResponseCodes extends AppResponseCodes {

    private FileResponseCodes(){}

    public static final String FILE_UNSUPPORTED_DESCRIPTION = "unsupported file type";
    public static final String FILE_EMPTY_DESCRIPTION = "file missing";
    public static final String INVALID_FILE_ID_DESCRIPTION = "invalid file id";


    public static ResponseStatusException FILE_UNSUPPORTED = new ResponseStatusException(HttpStatus.BAD_REQUEST, FILE_UNSUPPORTED_DESCRIPTION);

    public static ResponseStatusException FILE_EMPTY = new ResponseStatusException(HttpStatus.NOT_FOUND, FILE_EMPTY_DESCRIPTION);

    public static ResponseStatusException INVALID_FILE_ID = new ResponseStatusException(HttpStatus.NOT_FOUND, INVALID_FILE_ID_DESCRIPTION);



}
