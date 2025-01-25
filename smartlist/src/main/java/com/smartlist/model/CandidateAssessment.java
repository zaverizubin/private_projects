package com.smartlist.model;

import com.smartlist.enums.AssessmentDecision;
import com.smartlist.enums.CandidateAssessmentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "\"candidate_assessment\"")
@Getter
@Setter
public class CandidateAssessment extends BaseEntity {

    public static final String FIELD_CANDIDATE = "candidate";

    @Column(name = "\"start_date\"")
    LocalDateTime startDate;

    @Column(name = "\"end_date\"")
    LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    CandidateAssessmentStatus status = CandidateAssessmentStatus.IN_PROGRESS;

    @Enumerated(EnumType.STRING)
    AssessmentDecision assessmentDecision;

    @ManyToOne
    @JoinColumn(name = "\"active_assessment_block_id\"")
    @NotNull
    AssessmentBlock assessmentBlock;

    @ManyToOne
    @JoinColumn(name = "\"candidate_id\"")
    @NotNull
    Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "\"assessment_id\"")
    @NotNull
    Assessment assessment;

    @OneToMany(mappedBy = CandidateResponse.FIELD_CANDIDATE_ASSESSMENT)
    List<CandidateResponse> candidateResponse;

    public CandidateAssessment(){

    }

    public CandidateAssessment(final Candidate candidate, final Assessment assessment){
        setStartDate(LocalDateTime.now());
        setStatus(CandidateAssessmentStatus.IN_PROGRESS);
        setAssessmentBlock(assessment.getAssessmentBlocks().get(0));
        setCandidate(candidate);
        setAssessment(assessment);

    }
}