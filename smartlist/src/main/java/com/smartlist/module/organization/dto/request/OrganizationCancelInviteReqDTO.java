package com.smartlist.module.organization.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizationCancelInviteReqDTO {

    @Schema(description = "Email", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Email
    String email;


}
