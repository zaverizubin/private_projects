package com.smartlist.module.candidate.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.Assessment;
import com.smartlist.model.Candidate;
import com.smartlist.module.assessment.dto.request.AssessmentReqDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

@Getter
@Setter
public class UpdateCandidateProfileReqDTO {

    @Schema(description = "Candidate Name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String name;

    @Schema(description = "Candidate Email", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @Email
    @NotBlank
    String email;

    @Schema(description = "Candidate Photo Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @Nullable
    @Positive
    @JsonProperty(value="photo_id")
    Integer photoId;

    public static void addDTOToEntityMappings(final ModelMapper modelMapper){
        TypeMap<UpdateCandidateProfileReqDTO, Candidate> propertyMapper = modelMapper.createTypeMap(UpdateCandidateProfileReqDTO.class, Candidate.class);

        propertyMapper.addMappings(mapper -> mapper.skip(Candidate::setId));
    }

}
