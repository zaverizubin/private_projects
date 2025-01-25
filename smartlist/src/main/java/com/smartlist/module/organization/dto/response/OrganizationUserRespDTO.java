package com.smartlist.module.organization.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizationUserRespDTO {

    @Schema(description = "Organization User Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer id;

    @Schema(description = "Organization name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String name;

    @Schema(description = "Organization email", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @Email
    String email;

    @Schema(description = "Organization role", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    String role;

    @Schema(description = "Organization department", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    String department;

    @Schema(description = "Is active", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @NotNull
    Boolean active;

}
