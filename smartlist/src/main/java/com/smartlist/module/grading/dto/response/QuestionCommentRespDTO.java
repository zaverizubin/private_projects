package com.smartlist.module.grading.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionCommentRespDTO {

    @Schema(description = "Username", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String username;

    @Schema(description = "Comment", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String comment;



}
