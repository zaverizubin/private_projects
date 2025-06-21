package com.smartlist.module.report.records;

import lombok.Getter;

@Getter
public class ReportData1 {
      final Integer assessmentBlockId;

    final  String title;

    final  Long score;

    public ReportData1(Integer assessmentBlockId, String title, Long score){
        this.assessmentBlockId = assessmentBlockId;
        this.title = title;
        this.score = score;
    }
}

