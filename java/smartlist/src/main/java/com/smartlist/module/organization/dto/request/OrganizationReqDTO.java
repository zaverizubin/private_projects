package com.smartlist.module.organization.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.Organization;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

@Getter
@Setter
public class OrganizationReqDTO {

    @Schema(description = "Organization Name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String name;

    @Schema(description = "Organization URL", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @URL
    String url;

    @Schema(description = "Organization Email", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @Email
    String email;

    @Schema(description = "Organization Contact Number", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @JsonProperty(value = "contact_number")
    String contactNumber;

    @Schema(description = "About Organization", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String about;

    @Schema(description = "Organization Logo Id", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @Positive
    @JsonProperty(value = "logo_id")
    Integer logoId;

    public static void addDTOToEntityMappings(final ModelMapper modelMapper){
        TypeMap<OrganizationReqDTO, Organization> propertyMapper = modelMapper.createTypeMap(OrganizationReqDTO.class, Organization.class);

        propertyMapper.addMappings(mapper -> mapper.skip(Organization::setId));
    }
}
