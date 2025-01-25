package com.smartlist.enums;

public enum Disk {
    LOCAL("local"),
    S3("s3");

    String description;

    Disk(String description){
        this.description = description;
    }
}
