package com.smartlist.module.user.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

@Getter
@Setter
public class UpdateUserReqDTO {

    @Schema(description = "Username", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String name;

    @Schema(description = "User role", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    String role;

    @Schema(description = "User department", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    String department;

    @Schema(description = "User designation", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    String designation;

    @Schema(description = "User photo id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @Positive
    @JsonProperty(value = "photo_id")
    Integer photoId;

    public static void addDTOToEntityMappings(final ModelMapper modelMapper){
        TypeMap<UpdateUserReqDTO, User> propertyMapper = modelMapper.createTypeMap(UpdateUserReqDTO.class, User.class);

        propertyMapper.addMappings(mapper -> mapper.skip(User::setId));
    }
}
