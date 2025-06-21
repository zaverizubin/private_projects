package com.smartlist.enums;

public enum AssessmentDecision {
    SMARTLISTED("smartlisted"),
    SHORTLISTED("shortlisted"),
    ON_HOLD("on_hold"),
    REGRET("regret");

    String description;

    AssessmentDecision(String description){
        this.description = description;
    }

}
