package com.smartlist.module.organization.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.CandidateResponse;
import com.smartlist.model.Organization;
import com.smartlist.module.candidate.dto.response.CandidateResponseRespDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class OrganizationRespDTO {

    @Schema(description = "Organization Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer id;

    @Schema(description = "Organization name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String name;

    @Schema(description = "Organization url", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String url;

    @Schema(description = "Organization contact number", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @JsonProperty(value = "contact_number")
    String contactNumber;

    @Schema(description = "Organization email", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @Email
    String email;

    @Schema(description = "About the organization", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String about;

    @Schema(description = "Logo Id", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @Null
    @Positive
    @JsonProperty(value = "logo_id")
    Integer logoId;

    public static void addEntityToDTOMappings(final ModelMapper modelMapper){
        TypeMap<Organization, OrganizationRespDTO> propertyMapper = modelMapper.createTypeMap(Organization.class, OrganizationRespDTO.class);

        Converter<String, String> converter = ctx -> ctx.getSource() != null ? ctx.getSource() : "";
        propertyMapper.addMappings(mapper -> mapper.using(converter).map(Organization::getUrl, OrganizationRespDTO::setUrl));
        propertyMapper.addMappings(mapper -> mapper.using(converter).map(Organization::getAbout, OrganizationRespDTO::setAbout));
        propertyMapper.addMappings(mapper -> mapper.using(converter).map(Organization::getEmail, OrganizationRespDTO::setEmail));
        propertyMapper.addMappings(mapper -> mapper.using(converter).map(Organization::getContactNumber, OrganizationRespDTO::setContactNumber));
    }


}
