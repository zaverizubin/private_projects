package com.smartlist.module.grading.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssessmentDecisionReqDTO {

    @Schema(description = "Assessment Decision", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String decision;


}
