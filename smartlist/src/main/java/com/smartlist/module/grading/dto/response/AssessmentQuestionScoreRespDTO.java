package com.smartlist.module.grading.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.CandidateResponseScore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssessmentQuestionScoreRespDTO {

    @Schema(description = "Candidate Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "candidate_id")
    Integer candidateId;

    @Schema(description = "Assessment Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "assessment_id")
    Integer assessmentId;

    @Schema(description = "Assessment Block Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "assessment_block_id")
    Integer assessmentBlockId;

    @Schema(description = "Question Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "question_id")
    Integer questionId;

    @Schema(description = "Score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer score;

}
