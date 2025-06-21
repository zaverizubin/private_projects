package com.smartlist.module.report.records;


import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class ReportData8 {

    private final LocalDate date;
    private final Integer count;



    public ReportData8(final LocalDate date, final Integer count){
        this.date = date;
        this.count = count;
    }
}

