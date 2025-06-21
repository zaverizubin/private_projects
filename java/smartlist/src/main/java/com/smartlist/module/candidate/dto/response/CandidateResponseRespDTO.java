package com.smartlist.module.candidate.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.AssessmentBlock;
import com.smartlist.model.CandidateResponse;
import com.smartlist.model.Question;
import com.smartlist.module.assessment.dto.response.AssessmentRespDTO;
import com.smartlist.module.assessmentblock.dto.response.AssessmentBlockRespDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class CandidateResponseRespDTO {

    @Schema(description = "Candidate Response Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    Integer id;

    @Schema(description = "Candidate Question Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "question_id")
    Integer questionId;

    @Schema(description = "List of Answer Ids", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @JsonProperty(value = "answer_ids")
    List<String> answerIds;

    @Schema(description = "File Id", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @Positive
    @JsonProperty(value = "file_id")
    Integer fileId;

    @Schema(description = "Answer Text", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @JsonProperty(value = "answer_text")
    String answerText;

    public static void addEntityToDTOMappings(final ModelMapper modelMapper){
        TypeMap<CandidateResponse, CandidateResponseRespDTO> propertyMapper = modelMapper.createTypeMap(CandidateResponse.class, CandidateResponseRespDTO.class);

        Converter<String, List<String>> converter1 = ctx -> ctx.getSource() != null ? List.of(ctx.getSource().split(",")) : new ArrayList<>();
        propertyMapper.addMappings(mapper -> mapper.using(converter1).map(CandidateResponse::getAnswers, CandidateResponseRespDTO::setAnswerIds));

        Converter<String, String> converter2 = ctx -> ctx.getSource() != null ? ctx.getSource() : "";
        propertyMapper.addMappings(mapper -> mapper.using(converter2).map(CandidateResponse::getAnswerText, CandidateResponseRespDTO::setAnswerText));
    }

}
