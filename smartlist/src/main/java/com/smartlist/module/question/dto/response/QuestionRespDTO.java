package com.smartlist.module.question.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.Question;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class QuestionRespDTO {

    @Schema(description = "Question Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer id;

    @Schema(description = "Question type", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String type;

    @Schema(description = "Question text", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String text;

    @Schema(description = "Question score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer score;

    @Schema(description = "Question sort order", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "sort_order")
    Integer sortOrder;

    @Schema(description = "Answer options", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @JsonProperty(value = "answer_options")
    List<AnswerOptionRespDTO> answerOptions;

    @Schema(description = "Question options", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String options;

    /*
    public QuestionRespDTO(Question question, boolean forAssessment) {
        this.id = question.getId();
        this.type = question.getType().toString();
        this.text = question.getText();
        this.score = question.getScore();
        this.options = question.getOptions();
        this.sortOrder = question.getSortOrder();
        this.answerOptions = new ArrayList<>();
        question.getAnswerOptions().forEach(answerOption -> this.answerOptions.add(new AnswerOptionRespDTO(answerOption, forAssessment)));
    }*/


}
