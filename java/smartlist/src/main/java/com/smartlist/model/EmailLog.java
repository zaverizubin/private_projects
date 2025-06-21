package com.smartlist.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "\"email_log\"")
@Getter
@Setter
public class EmailLog extends BaseEntity {

    boolean status;

    @Column(length=255)
    String sender;

    @Column(length=255)
    String receiver;

    @Column(name = "\"error_log\"", columnDefinition = "text")
    String errorLog;

    @Column(columnDefinition = "text")
    String message;
}
