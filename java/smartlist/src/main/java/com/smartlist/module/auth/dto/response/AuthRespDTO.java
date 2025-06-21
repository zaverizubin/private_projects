package com.smartlist.module.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRespDTO {

    @Schema(description = "Token Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer id;

    @Schema(description = "Token", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @JsonProperty(value = "access_token")
    String accessToken;

    public AuthRespDTO(Integer id, String accessToken) {
        this.id = id;
        this.accessToken = accessToken;
    }


}
