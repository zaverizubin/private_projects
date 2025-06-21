package com.smartlist.module.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegenerateVerificationEmailReqDTO {

    @Schema(description = "email address", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @Email
    String email;


}
