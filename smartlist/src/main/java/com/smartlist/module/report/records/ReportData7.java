package com.smartlist.module.report.records;


import lombok.Getter;

@Getter
public class ReportData7 {

    private final Integer assessmentId;
    private final Integer inProgress;
    private final Integer gradingPending;
    private final Integer gradingCompleted;

    public ReportData7(final Integer assessmentId, final Integer inProgress, final Integer gradingPending, final Integer gradingCompleted){
        this.assessmentId = assessmentId;
        this.inProgress = inProgress;
        this.gradingPending = gradingPending;
        this.gradingCompleted = gradingCompleted;
    }
}

