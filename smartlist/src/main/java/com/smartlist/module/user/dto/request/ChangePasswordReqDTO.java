package com.smartlist.module.user.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.utils.RegexPatterns;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordReqDTO {

    @Schema(description = "Old Password", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @Size(min = 6, max = 12)
    @Pattern(message="min 6 upto max 12 characters in length" , regexp= RegexPatterns.PASSWORD)
    @JsonProperty(value = "old_password")
    String oldPassword;

    @Schema(description = "New Password", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @Size(min = 6, max = 12)
    @Pattern(message="min 6 upto max 12 characters in length" , regexp= RegexPatterns.PASSWORD)
    @JsonProperty(value = "new_password")
    String newPassword;


}
