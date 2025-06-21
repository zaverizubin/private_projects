package com.smartlist.module.question.dto.request;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerOptionReqDTO {

    @Schema(description = "Answer Option Text", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String text;

    @Schema(description = "Correct answer option", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    Boolean correct;

    @Schema(description = "Score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @PositiveOrZero
    @NotNull
    Integer score;


}
