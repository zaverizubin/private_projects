package com.smartlist.enums;

public enum AssessmentStatus {

    DRAFT("draft"),
    ACTIVE("active"),
    ARCHIVED("archived");

    String description;

    AssessmentStatus(String description){
        this.description = description;
    }
}
