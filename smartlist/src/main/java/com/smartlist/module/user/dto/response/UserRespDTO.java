package com.smartlist.module.user.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRespDTO {

    @Schema(description = "User Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    Integer id;

    @Schema(description = "User name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    String name;

    @Schema(description = "User email", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    String email;

    @Schema(description = "Is account active", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    Boolean active;

    @Schema(description = "User role", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    String role;

    @Schema(description = "Department name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    String department;

    @Schema(description = "Designation", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    String designation;

    @Schema(description = "Access token", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @JsonProperty(value = "access_token")
    String accessToken;

    @Schema(description = "Refresh token", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @JsonProperty(value = "refresh_token")
    String refreshToken;

    @Schema(description = "Organization Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @JsonProperty(value = "organization_id")
    Integer organizationId;

    @Schema(description = "Photo Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @JsonProperty(value = "photo_id")
    Integer photoId;



}
