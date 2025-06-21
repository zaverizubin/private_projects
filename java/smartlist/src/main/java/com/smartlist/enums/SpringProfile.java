package com.smartlist.enums;

public enum SpringProfile {

    DEFAULT("default"),
    PROD("prod"),
    DEV("dev"),
    TEST("test");

    String label;
    private SpringProfile(String label){
        this.label = label;
    }



}
