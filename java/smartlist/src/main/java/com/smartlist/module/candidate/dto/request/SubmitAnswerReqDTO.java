package com.smartlist.module.candidate.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SubmitAnswerReqDTO {

    @Schema(description = "list of Answer Ids", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @JsonProperty(value = "answer_ids")
    List<Integer> answerIds;

    @Schema(description = "Answer Text", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @JsonProperty(value = "answer_text")
    String answerText;

    @Schema(description = "File Id", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @Positive
    @JsonProperty(value = "file_id")
    Integer fileId;


}
