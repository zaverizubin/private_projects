package com.smartlist.module.assessmentblock.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.AssessmentBlock;
import com.smartlist.model.Question;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import java.util.List;

@Getter
@Setter
public class AssessmentBlockRespDTO {

    @NotNull
    @Positive
    Integer id;

    @Schema(description = "Assessment Block Title", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Size(min = 1, max = 255)
    String title;

    @Schema(description = "Assessment Block Instruction", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @Size(min = 1, max = 5000)
    String instruction;

    @Schema(description = "Assessment Block Duration", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    Integer duration;

    @Schema(description = "Assessment Block Closing Comments", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty(value = "closing_comments")
    String closingComments;

    @Schema(description = "Assessment Block Points", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    Integer points;

    @Schema(description = "Assessment Block Sort Order", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @JsonProperty(value = "sort_order")
    Integer sortOrder;

    public static void addEntityToDTOMappings(final ModelMapper modelMapper){
        TypeMap<AssessmentBlock, AssessmentBlockRespDTO> propertyMapper = modelMapper.createTypeMap(AssessmentBlock.class, AssessmentBlockRespDTO.class);

        Converter<List<Question>, Integer> converter = ctx -> ctx.getSource() != null ? ctx.getSource().stream().mapToInt(Question::getScore).sum() : 0;
        propertyMapper.addMappings(mapper -> mapper.using(converter).map(AssessmentBlock::getQuestions, AssessmentBlockRespDTO::setPoints));
    }

}
