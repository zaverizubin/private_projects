package com.smartlist.enums;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public enum TimeoutConfig {

    EMAIL_INVITE_LINK(2 * 24 * 60 * 60 * 1000), //2 days
    EMAIL_VERIFY_LINK(2 * 24 * 60 * 60 * 1000), //2 days
    FORGOT_PASSWORD_LINK(2 * 24 * 60 * 60 * 1000), //2 days
    ASSESSMENT_DURATION(5 * 24 * 60 * 60 * 1000),
    ACCESS_TOKEN_DURATION(60 * 60 * 24),
    REFRESH_TOKEN_DURATION(60 * 60 * 24 * 7);

    private final Integer value;

    private TimeoutConfig(final Integer value){
        this.value = value;
    }

    public static boolean isExpired(final LocalDateTime dateTime, final TimeoutConfig timeout) {
        return dateTime.plus(timeout.getValue(), ChronoUnit.MILLIS).isBefore(LocalDateTime.now());
    }

    public Integer getValue() {
        return this.value;
    }
}
