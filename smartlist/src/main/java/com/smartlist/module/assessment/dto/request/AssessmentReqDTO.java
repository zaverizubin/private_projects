package com.smartlist.module.assessment.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.Assessment;
import com.smartlist.model.AssessmentBlock;
import com.smartlist.model.Organization;
import com.smartlist.model.Question;
import com.smartlist.module.assessmentblock.dto.response.AssessmentBlockRespDTO;
import com.smartlist.module.organization.dto.request.OrganizationReqDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import java.util.List;

@Getter
@Setter
public class AssessmentReqDTO {

    @Schema(description = "Name of the Assessment.", example = "Assessment 1", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String name;

    @Schema(description = "Assessment position", example = "Sales Manager", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String position;

    @Schema(description = "Department", example = "Sales and Marketing", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String department;

    @Schema(description = "Assessment Introduction", example = "An introduction about the assessment", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String introduction;

    @Schema(description = "Header Image Id", example = "1", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @Positive
    @JsonProperty(value = "header_image_id")
    Integer headerImageId;

    @Schema(description = "Video Link URL", example = "http://vimeo/videos/1", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @URL
    @JsonProperty(value = "video_link_url")
    String videoLinkUrl;

    @Schema(description = "Organization Id", example = "2", requiredMode= Schema.RequiredMode.REQUIRED)
    @Positive
    @JsonProperty(value = "organization_id")
    int organizationId;

    public static void addDTOToEntityMappings(final ModelMapper modelMapper){
        TypeMap<AssessmentReqDTO, Assessment> propertyMapper = modelMapper.createTypeMap(AssessmentReqDTO.class, Assessment.class);

        propertyMapper.addMappings(mapper -> mapper.skip(Assessment::setId));
    }
}