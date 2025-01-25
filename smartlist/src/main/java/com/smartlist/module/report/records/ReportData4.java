package com.smartlist.module.report.records;

import lombok.Getter;

@Getter
public class ReportData4 {

    private final String title;
    private final Integer groupAvgScore;
    private final Integer candidateScore;

    public ReportData4(final String title, final Integer groupAvgScore, final Integer candidateScore){
        this.title = title;
        this.groupAvgScore = groupAvgScore;
        this.candidateScore = candidateScore;
    }
}

