package com.smartlist.module.report.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssessmentStatusSummaryRespDTO {

    @Schema(description = "Assessment in progress count", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "in_progress")
    final Integer inProgress;

    @Schema(description = "Assessment completed count", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    final Integer completed;

    @Schema(description = "Assessment screened count", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    final Integer screened;

    public AssessmentStatusSummaryRespDTO(final Integer inProgress, final Integer completed, final Integer screened) {
        this.inProgress = inProgress;
        this.completed = completed;
        this.screened = screened;
    }

}
