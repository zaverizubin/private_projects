package com.smartlist.module.organization.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class InviteToOrganizationReqDTO {

    @Schema(description = "User Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer userId;

    @Schema(description = "List of emails", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    List<String> emails;

}
