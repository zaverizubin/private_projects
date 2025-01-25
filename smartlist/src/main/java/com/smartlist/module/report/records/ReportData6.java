package com.smartlist.module.report.records;

import lombok.Getter;

@Getter
public class ReportData6 {

    private final Integer assessmentId;
    private final Integer smartListed;
    private final Integer shortListed;
    private final Integer onHold;
    private final Integer regret;
    private final Integer decisionPending;

    public ReportData6(final Integer assessmentId, final Integer smartListed, final Integer shortListed,
                       final Integer onHold, final Integer regret, final Integer decisionPending){
        this.assessmentId = assessmentId;
        this.smartListed = smartListed;
        this.shortListed = shortListed;
        this.onHold = onHold;
        this.regret = regret;
        this.decisionPending = decisionPending;
    }
}

