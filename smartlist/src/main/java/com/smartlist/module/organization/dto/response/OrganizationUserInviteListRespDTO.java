package com.smartlist.module.organization.dto.response;

import com.smartlist.model.UserEmailInvite;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class OrganizationUserInviteListRespDTO {

    @Schema(description = "List of emails", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    List<String> emails;

    public OrganizationUserInviteListRespDTO(List<UserEmailInvite> userEmailInvites) {
        this.emails = new ArrayList<>();
        userEmailInvites.forEach(obj -> this.emails.add(obj.getEmail()));
    }


}
