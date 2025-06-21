package com.smartlist.module.report.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.module.report.records.ReportData2;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AssessmentCandidatePerformanceRespDTO {

    @Schema(description = "Candidate Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "candidate_id")
    final Integer candidateId;

    @Schema(description = "Assessment Name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    final String name;

    @Schema(description = "Assessment Start Date", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @JsonProperty(value = "start_date")
    final LocalDateTime startDate;

    @Schema(description = "Assessment End Date", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @JsonProperty(value = "end_date")
    final LocalDateTime endDate;

    @Schema(description = "Assessment Last Submission Date", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @JsonProperty(value = "last_submission_date")
    LocalDateTime lastSubmissionDate;

    @Schema(description = "Assessment Status", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    final String status;

    @Schema(description = "Assessment Decision", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @JsonProperty(value = "assessment_decision")
    final String assessmentDecision;

    @Schema(description = "Candidate Average Score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "candidate_average_score")
    final Integer candidateAverageScore;

    @Schema(description = "Group Average Score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "group_average_score")
    final Integer groupAverageScore;

    public AssessmentCandidatePerformanceRespDTO(final ReportData2 reportData2) {
        this.candidateId = reportData2.getCandidateId();
        this.name = reportData2.getCandidateName();
        this.startDate = reportData2.getStartDate();
        this.endDate = reportData2.getEndDate();
        this.lastSubmissionDate = null;
        this.status = reportData2.getStatus().toString();
        this.assessmentDecision = reportData2.getAssessmentDecision().toString();
        this.candidateAverageScore = reportData2.getCandidateAverageScore();
        this.groupAverageScore = reportData2.getGroupAverageScore();
    }

}
