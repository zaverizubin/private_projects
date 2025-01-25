package com.smartlist.module.report.records;


import com.smartlist.enums.AssessmentDecision;
import com.smartlist.enums.CandidateAssessmentStatus;

import java.time.LocalDateTime;

public class ReportData2 {

    private Integer candidateId;
    private String candidateName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private CandidateAssessmentStatus status;
    private AssessmentDecision assessmentDecision;
    private Long score;
    private int groupAverageScore;
    private int candidateAverageScore;

    public ReportData2(final Integer candidateId, final String candidateName, final LocalDateTime startDate, final LocalDateTime endDate,
                       final CandidateAssessmentStatus status, final AssessmentDecision assessmentDecision, final Long score) {

        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.assessmentDecision = assessmentDecision;
        this.score = score;
    }

    public ReportData2(final int candidateId, final String candidateName, final Long score) {
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.score = score;
    }

    public int getCandidateId() {
        return this.candidateId;
    }

    public void setCandidateId(int candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return this.candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public LocalDateTime getStartDate() {
        return this.startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return this.endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public CandidateAssessmentStatus getStatus() {
        return this.status;
    }

    public void setStatus(CandidateAssessmentStatus status) {
        this.status = status;
    }

    public AssessmentDecision getAssessmentDecision() {
        return this.assessmentDecision;
    }

    public void setAssessmentDecision(AssessmentDecision assessmentDecision) {
        this.assessmentDecision = assessmentDecision;
    }

    public Long getScore() {
        return this.score;
    }

    public void setScore(Long score) {
        this.score = score;
    }

    public int getGroupAverageScore() {
        return this.groupAverageScore;
    }

    public void setGroupAverageScore(int groupAverageScore) {
        this.groupAverageScore = groupAverageScore;
    }

    public int getCandidateAverageScore() {
        return this.candidateAverageScore;
    }

    public void setCandidateAverageScore(int candidateAverageScore) {
        this.candidateAverageScore = candidateAverageScore;
    }


}