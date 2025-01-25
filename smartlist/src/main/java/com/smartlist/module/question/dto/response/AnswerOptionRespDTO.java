package com.smartlist.module.question.dto.response;

import com.smartlist.model.AnswerOption;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerOptionRespDTO {

    @Schema(description = "Answer option Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer id;

    @Schema(description = "Answer option text", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String text;

    @Schema(description = "Is correct answer option", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    Boolean correct;

    @Schema(description = "Answer option score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer score;

    /*
    AnswerOptionRespDTO(AnswerOption answerOption, boolean forAssessment) {
        this.id = answerOption.getId();
        this.text = answerOption.getText();
        this.score = answerOption.getScore();
        this.correct = forAssessment ? null : answerOption.isCorrect();
    }*/


}
