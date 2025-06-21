package com.smartlist.module.assessment.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssessmentStatusCountRespDTO {

    @Schema(description = "Active Assessment Count", example = "1", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    Integer active;

    @Schema(description = "Archived Assessment Count", example = "1", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    Integer archived;

    @Schema(description = "Draft Assessment Count", example = "1", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    Integer drafts;

    public AssessmentStatusCountRespDTO(final Integer active, final Integer archived, final Integer drafts) {
        this.active = active;
        this.archived = archived;
        this.drafts = drafts;
    }

}
