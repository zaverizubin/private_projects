package com.smartlist.module.report.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.module.report.records.ReportData6;
import com.smartlist.module.report.records.ReportData7;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssessmentDecisionSummaryRespDTO {

    @Schema(description = "Assessment Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "assessment_id")
    final Integer assessmentId;

    @Schema(description = "Count SmartListed", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "smart_listed")
    final Integer smartListed;

    @Schema(description = "Count ShortListed", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "short_listed")
    final Integer shortListed;

    @Schema(description = "Count Decision Pending", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "decision_pending")
    final Integer decisionPending;

    @Schema(description = "Count OnHold", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "on_hold")
    final Integer onHold;

    @Schema(description = "Count InProgress", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "in_progress")
    final Integer inProgress;

    @Schema(description = "Count Grading Pending", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "grading_pending")
    final Integer gradingPending;

    @Schema(description = "Count Grading Completed", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "grading_completed")
    final Integer gradingCompleted;

    @Schema(description = "Count Regret", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    final Integer regret;

    public AssessmentDecisionSummaryRespDTO(final ReportData6 reportData6, ReportData7 reportData7) {
        this.assessmentId = reportData6.getAssessmentId();
        this.smartListed = reportData6.getSmartListed();
        this.shortListed = reportData6.getShortListed();
        this.decisionPending = reportData6.getDecisionPending();
        this.onHold = reportData6.getOnHold();
        this.regret = reportData6.getRegret();
        this.inProgress = reportData7.getInProgress();
        this.gradingPending = reportData7.getGradingPending();
        this.gradingCompleted = reportData7.getGradingCompleted();

    }
}
