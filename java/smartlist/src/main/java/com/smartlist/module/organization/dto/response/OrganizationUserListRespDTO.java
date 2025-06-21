package com.smartlist.module.organization.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrganizationUserListRespDTO {

    @Schema(description = "List of users", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    List<OrganizationUserRespDTO> users;

    OrganizationUserListRespDTO(List<OrganizationUserRespDTO> users) {
        this.users = users;
    }


}
