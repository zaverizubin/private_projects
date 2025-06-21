package com.smartlist.module.assessmentblock.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.AssessmentBlock;
import com.smartlist.module.assessmentblock.dto.response.AssessmentBlockRespDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

@Getter
@Setter
public class AssessmentBlockReqDTO {

    @Schema(description = "Assessment Block Title", example = "1", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Size(min = 1, max = 255)
    String title;

    @Schema(description = "Assessment Block Instruction", example = "1", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Size(min = 1, max = 5000)
    String instruction;

    @Schema(description = "Assessment Block Duration", example = "1", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer duration;

    @Schema(description = "Assessment Block Closing Comments", example = "1", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @Size(min = 1, max = 5000)
    @JsonProperty(value = "closing_comments")
    String closingComments;

}
