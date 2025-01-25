package com.smartlist.module.auth.dto.request;

import com.smartlist.utils.RegexPatterns;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthReqDTO {

    @Schema(description = "Email Address", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Email
    String email;

    @Schema(description = "Password", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Size(min = 6, max = 12)
    @Pattern(message="min 6 upto max 12 characters in length" , regexp= RegexPatterns.PASSWORD)
    String password;


}
