package com.smartlist.module.grading.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionCommentReqDTO {

    @Schema(description = "Username", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String username;

    @Schema(description = "Comment", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String comment;


}
