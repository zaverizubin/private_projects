package com.smartlist.module.candidate.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.enums.AssessmentDecision;
import com.smartlist.model.Assessment;
import com.smartlist.model.CandidateAssessment;
import com.smartlist.module.assessment.dto.response.AssessmentRespDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
public class CandidateAssessmentRespDTO {

    @Schema(description = "Candidate Assessment Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer id;

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

    @Schema(description = "Active Assessment Block Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "active_assessment_block_id")
    Integer assessmentBlockId;

    @Schema(description = "Status", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String status;

    @Schema(description = "Start Date", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @JsonProperty(value = "start_date")
    LocalDateTime startDate;

    @Schema(description = "End Date", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @JsonProperty(value = "end_date")
    LocalDateTime endDate;

    AssessmentDecision assessmentDecision;

}
