package com.smartlist.enums;

public enum CandidateAssessmentStatus {

    IN_PROGRESS("in_progress"),
    GRADING_PENDING("grading_pending"),
    GRADING_COMPLETED ("grading_completed");

    String description;

    CandidateAssessmentStatus(String description){
        this.description = description;
    }
}
