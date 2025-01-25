package com.smartlist.module.report.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AssessmentBlockAverageScoreRespDTO {

    @Schema(description = "Assessment Block Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "assessment_block_id")
    Integer assessmentBlockId;

    @Schema(description = "Assessment Block Title", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String title;

    @Schema(description = "Average Score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "average_score")
    Long score;

}
