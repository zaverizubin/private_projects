package com.smartlist.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "\"candidate_response_score\"")
@Getter
@Setter
public class CandidateResponseScore extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "\"candidate_id\"")
    @NotNull
    Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "\"assessment_id\"")
    @NotNull
    Assessment assessment;

    @ManyToOne
    @JoinColumn(name = "\"assessment_block_id\"")
    @NotNull
    AssessmentBlock assessmentBlock;

    @ManyToOne
    @JoinColumn(name = "\"question_id\"")
    @NotNull
    Question question;

    Integer score;

    public CandidateResponseScore(){

    }

    public CandidateResponseScore(final Candidate candidate, final Question question){
        setCandidate(candidate);
        setQuestion(question);
        setAssessmentBlock(question.getAssessmentBlock());
        setAssessment(question.getAssessmentBlock().getAssessment());
    }

}

