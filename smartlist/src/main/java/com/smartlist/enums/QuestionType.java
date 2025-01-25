package com.smartlist.enums;

public enum QuestionType {

    SCORED_MCQ_SINGLE("scored_mcq_single"),
    SCORED_MCQ_SINGLE_WEIGHTED_SELECT("scored_mcq_single_weighted_select"),
    SCORED_MCQ_MULTIPLE("scored_mcq_multiple"),
    SURVEY("survey"),
    VIDEO_RESPONSE("video_response"),
    TEXT_RESPONSE("text_response"),
    FILE_RESPONSE("file_response");

    private String description;

    QuestionType(String description){
        this.description = description;
    }
}
