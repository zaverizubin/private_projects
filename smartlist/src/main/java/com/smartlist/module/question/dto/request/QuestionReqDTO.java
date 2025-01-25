package com.smartlist.module.question.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuestionReqDTO {

    @Schema(description = "Question Type", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String type;

    @Schema(description = "Question text", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String text;

    @Schema(description = "Question score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    Integer score;

    @Schema(description = "List of answer options", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @JsonProperty(value="answer_options")
    List<AnswerOptionReqDTO> answerOptions;

    @Schema(description = "Question options", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    QuestionOptionReqDTO options;


}
