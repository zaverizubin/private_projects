package com.smartlist.error;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class APIError {

    private HttpStatus status;
    private String message;
    private List<String> errors;

    public APIError(HttpStatus status, String message, List<String> errors) {
        super();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    public APIError(HttpStatus status, String message, String error) {
        super();
        this.status = status;
        this.message = message;
        this.errors = !StringUtils.isEmpty(error)? List.of(error):new ArrayList<>();
    }
}
