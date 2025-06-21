package com.smartlist.module.assessment.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.Assessment;
import com.smartlist.model.CandidateResponse;
import com.smartlist.module.candidate.dto.response.CandidateResponseRespDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AssessmentRespDTO {

    @Schema(description = "Assessment Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer id;

    @Schema(description = "Assessment Name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String name;

    @Schema(description = "Job Position", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    String position;

    @Schema(description = "Department", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    String department;

    @Schema(description = "Assessment Introduction", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String introduction;

    @Schema(description = "Assessment Status", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String status;

    @Schema(description = "Assessment Token", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String token;

    @Schema(description = "Header Image", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "header_image_id")
    Integer headerImageId;

    @Schema(description = "Video Link URL", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty(value = "video_link_url")
    String videoLinkUrl;

    @Schema(description = "Organization Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "organization_id")
    Integer organizationId;


}
