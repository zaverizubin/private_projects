package com.smartlist.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "\"sms_log\"")
@Getter
@Setter
public class SMSLog extends BaseEntity{

    String status;

    @Column(length=255)
    String sender;

    @Column(length=255)
    String receiver;

    @Column(columnDefinition = "text")
    String response;

    @Column(length=255)
    String uid;
}
