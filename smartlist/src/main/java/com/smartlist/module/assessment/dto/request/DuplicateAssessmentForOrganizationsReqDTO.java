package com.smartlist.module.assessment.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DuplicateAssessmentForOrganizationsReqDTO {

    @Schema(description = "Assessment Id", example = "1", requiredMode= Schema.RequiredMode.REQUIRED)
    @Positive
    @NotNull
    Integer assessmentId;

    @Schema(description = "List of Organization Ids", example = "1", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    List<Integer> organizationIds;


}
