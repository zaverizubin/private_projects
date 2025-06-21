package com.smartlist.error;

public  class Violation {

    private final String fieldName;

    private final String message;

    public Violation(final String fieldName, final String message){
        this.fieldName = fieldName;
        this.message = message;
    }

    public String getFieldName() {
        return this.fieldName;
    }

    public String getMessage() {
        return this.message;
    }
}