package com.smartlist.module.report.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HighLevelSummaryRespDTO {

    @Schema(description = "Count of unique Assessments", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "unique_assessments")
    final Long uniqueAssessments;

    @Schema(description = "Count of candidate submissions", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "candidate_submissions")
    final Long candidateSubmissions;

    @Schema(description = "Count of smartListed candidates", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "candidate_smart_listed")
    final Long candidatesSmartListed;

    public HighLevelSummaryRespDTO(final Long uniqueAssessments, final Long candidateSubmissions, final Long candidatesSmartListed) {
        this.uniqueAssessments = uniqueAssessments;
        this.candidateSubmissions = candidateSubmissions;
        this.candidatesSmartListed = candidatesSmartListed;
    }


}
