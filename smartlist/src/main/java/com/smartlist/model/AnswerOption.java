package com.smartlist.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "\"answer_option\"")
@Getter
@Setter
public class AnswerOption  extends BaseEntity{

    public static final String FIELD_QUESTION = "question";

    private boolean correct;

    @Column(length=1000)
    private String text;

    @ManyToOne
    @NotNull(message = "{Select a Question}")
    private Question question;

    private Integer score;



}
