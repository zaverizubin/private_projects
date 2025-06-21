package com.smartlist.utils;

import java.time.LocalDate;
import java.util.Date;

public class DateUtils {

    public static String getDateFromISOFormattedDate(String isoDate) {
    final Date date  = new Date(isoDate);
         Integer year = date.getYear();
         Integer month = date.getMonth() + 1;
         Integer day = date.getDate();

        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        return month + "/" + day + "/" + year;
    }

    public static LocalDate getFormattedDate() {
        return LocalDate.now();
    }

    public static String getISOFormattedDateAtSOD(LocalDate from) {
        return "";
    }

    public static String getISOFormattedDateAtEOD(LocalDate to) {
        return "";
    }
}
