package com.smartlist.module.report.records;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReportData3 {

    private final Integer candidateId;
    private final LocalDateTime lastSubmissionDate;

    public ReportData3(final Integer candidateId, final LocalDateTime lastSubmissionDate){
        this.candidateId = candidateId;
        this.lastSubmissionDate = lastSubmissionDate;
    }
}

