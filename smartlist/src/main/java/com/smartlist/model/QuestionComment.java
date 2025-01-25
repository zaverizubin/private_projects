package com.smartlist.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "\"question_comment\"")
@Getter
@Setter
public class QuestionComment extends BaseEntity {

    @Column(length=100)
    String username;

    @Column(length=100)
    String comment;

    @ManyToOne
    @JoinColumn(name = "\"question_id\"")
    @NotNull
    Question question;

    @ManyToOne
    @JoinColumn(name = "\"candidate_id\"")
    @NotNull
    Candidate candidate;
}
