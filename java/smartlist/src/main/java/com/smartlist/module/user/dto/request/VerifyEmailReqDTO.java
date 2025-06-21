package com.smartlist.module.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyEmailReqDTO {

    @Schema(description = "Token", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String token;


}
