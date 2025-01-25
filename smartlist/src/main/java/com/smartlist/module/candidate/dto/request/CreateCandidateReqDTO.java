package com.smartlist.module.candidate.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.Candidate;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

@Getter
@Setter
public class CreateCandidateReqDTO {

    @Schema(description = "Candidate Contact Number", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @JsonProperty(value = "contact_number")
    String contactNumber;

    @Schema(description = "Candidate Email", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Email
    String email;

    @Schema(description = "Candidate Name", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @NotBlank
    String name;

    @Schema(description = "Candidate Photo Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @JsonProperty(value = "photo_id")
    Integer photoId;

    public static void addDTOToEntityMappings(final ModelMapper modelMapper){
        TypeMap<CreateCandidateReqDTO, Candidate> propertyMapper = modelMapper.createTypeMap(CreateCandidateReqDTO.class, Candidate.class);

        propertyMapper.addMappings(mapper -> mapper.skip(Candidate::setId));
    }
}
