package com.smartlist.module.question.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionOptionReqDTO {

    @Schema(description = "File required", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty(value="file_required")
    Boolean fileRequired;

    @Schema(description = "Text required", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty(value="text_required")
    Boolean textRequired;


}
