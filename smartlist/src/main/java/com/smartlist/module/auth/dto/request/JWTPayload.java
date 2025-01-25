package com.smartlist.module.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JWTPayload {

    @Schema(description = "", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer sub;

    @Schema(description = "Email Address", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Email
    String email;

    @Schema(description = "User Role", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String role;

    JWTPayload(Integer sub, String email, String role) {
        this.sub = sub;
        this.email = email;
        this.role = role;
    }


}
