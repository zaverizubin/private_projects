package com.smartlist.module.candidate.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateRespDTO {

    @Schema(description = "Candidate Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer id;

    @Schema(description = "Candidate Name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String name;

    @Schema(description = "Candidate Email", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Email
    String email;

    @Schema(description = "Candidate Contact Number", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty(value = "contact_number")
    String contactNumber;

    @Schema(description = "Is Candidate Verified", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    Boolean verified;

    @Schema(description = "Is Candidate Verified", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @Positive
    @JsonProperty(value = "photo_id")
    Integer photoId;

}
