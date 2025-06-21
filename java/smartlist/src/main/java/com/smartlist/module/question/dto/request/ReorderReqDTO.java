package com.smartlist.module.question.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReorderReqDTO {

    @Schema(description = "Answer Options order", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    List<@Positive Integer> ids;


}
