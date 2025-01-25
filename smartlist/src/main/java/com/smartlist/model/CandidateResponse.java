package com.smartlist.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "\"candidate_response\"")
@Getter
@Setter
public class CandidateResponse extends BaseEntity {

    public static final String FIELD_CANDIDATE_ASSESSMENT = "candidateAssessment";

    String answers;

    @Column(length=5000, name = "\"answer_text\"")
    String answerText;

    @OneToOne
    @JoinColumn(name = "\"file_id\"")
    AssetFile file;

    @ManyToOne
    @JoinColumn(name = "\"question_id\"")
    @NotNull
    Question question;

    @ManyToOne
    @JoinColumn(name = "\"candidate_assessment_id\"")
    @NotNull
    CandidateAssessment candidateAssessment;
}
