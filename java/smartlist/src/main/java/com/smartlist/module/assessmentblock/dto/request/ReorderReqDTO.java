package com.smartlist.module.assessmentblock.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReorderReqDTO {

    @Schema(description = "Assessment Block Id List", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    List<Integer> ids;


}
