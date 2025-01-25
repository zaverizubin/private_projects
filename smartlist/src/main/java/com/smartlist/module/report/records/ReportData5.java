package com.smartlist.module.report.records;


import lombok.Getter;

import java.time.LocalDate;

@Getter
public class ReportData5 {
    private Integer assessmentId;
    private String title;
    private String department;
    private LocalDate activatedOn;
    private Long registered;
    private Long completed;
    private Long smartListed;

    public ReportData5(){

    }

    public ReportData5(final Integer assessmentId, final String title, final String department, final LocalDate activatedOn,
                       final Long registered, final Long completed, final Long smartListed){

        this.assessmentId = assessmentId;
        this.title = title;
        this.department = department;
        this.activatedOn = activatedOn;
        this.registered = registered;
        this.completed = completed;
        this.smartListed = smartListed;
    }
}

