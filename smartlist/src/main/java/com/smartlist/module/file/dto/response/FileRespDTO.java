package com.smartlist.module.file.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileRespDTO {

    @Schema(description = "File Id", example = "", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer id;

    @Schema(description = "File URL", example = "", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank
    String url;



}

