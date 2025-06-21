package com.smartlist.module.question;

import com.smartlist.module.question.dto.request.QuestionReqDTO;
import com.smartlist.module.question.dto.request.ReorderReqDTO;
import com.smartlist.module.question.dto.response.QuestionRespDTO;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Question", description = "Question API")
@RequestMapping(value ="", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
@Secured({"SUPERADMIN", "ADMIN", "MEMBER"})
public class QuestionController {

    private static final String ROOT_ROUTE = "/question";

    private final QuestionService questionService;

    QuestionController(final QuestionService questionService){
        this.questionService = questionService;
    }

    @Secured({"SUPERADMIN", "ADMIN", "MEMBER", "CANDIDATE"})
    @Operation(summary = "Get assessment block questions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = QuestionRespDTO.class))) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("/assessment-block/{id}" + QuestionController.ROOT_ROUTE)
    public List<QuestionRespDTO> getAll(@PathVariable("id") @Positive Integer assessmentBlockId) {
        return  this.questionService.getAllByAssessmentBlockId(assessmentBlockId, false);
    }

    @Secured({"SUPERADMIN", "ADMIN", "MEMBER", "CANDIDATE"})
    @Operation(summary = "Get assessment block questions without correct option field value")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = QuestionRespDTO.class))) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("/assessment-block/{id}" + QuestionController.ROOT_ROUTE + "/for-assessment")
    public List<QuestionRespDTO> getAllForAssessment(@PathVariable("id") @Positive Integer id) {
        return this.questionService.getAllByAssessmentBlockId(id, true);
    }

    @Operation(summary = "Get question")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = QuestionRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = QuestionResponseCodes.INVALID_QUESTION_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping(QuestionController.ROOT_ROUTE + "/{id}")
    public QuestionRespDTO get(@PathVariable("id") @Positive Integer id) {
        return this.questionService.getQuestionById(id, false);
    }

    @Secured({"SUPERADMIN", "ADMIN", "MEMBER", "CANDIDATE"})
    @Operation(summary = "Get question without correct option field value")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = QuestionRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = QuestionResponseCodes.INVALID_QUESTION_OPTION_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping(QuestionController.ROOT_ROUTE + "/{id}/for-assessment")
    public QuestionRespDTO getForAssessment(@PathVariable("id") @Positive Integer id) {
        return  this.questionService.getQuestionById(id, true);
    }

    @Operation(summary = "Create question")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = QuestionResponseCodes.INVALID_QUESTION_OPTION_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)

    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/assessment-block/{id}" + QuestionController.ROOT_ROUTE)
    public Integer create(@PathVariable("id") @Positive Integer id, @RequestBody() @Valid QuestionReqDTO questionReqDto){
        return this.questionService.createQuestion(id, questionReqDto);
    }

    @Operation(summary = "Update question")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = QuestionResponseCodes.INVALID_QUESTION_OPTION_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = QuestionResponseCodes.INVALID_QUESTION_ID_DESCRIPTION, content = @Content)
    })
    @PutMapping(QuestionController.ROOT_ROUTE + "/{id}")
    public void update(
            @PathVariable("id") @Positive Integer id,
            @RequestBody() @Valid QuestionReqDTO questionReqDto) {
        this.questionService.updateQuestion(id, questionReqDto);
    }

    @Operation(summary = "Reorder questions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = QuestionResponseCodes.ASSESSMENT_ACTION_DENIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = QuestionResponseCodes.INVALID_QUESTION_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping("/assessment-block/{id}" + QuestionController.ROOT_ROUTE + "/reorder")
    public void reorder(
            @PathVariable("id") @Positive Integer id,
            @RequestBody() @Valid ReorderReqDTO reorderReqDto) {
        this.questionService.reorderQuestions(id, reorderReqDto);
    }

    @Operation(summary = "Delete question")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = QuestionResponseCodes.ASSESSMENT_ACTION_DENIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = QuestionResponseCodes.INVALID_QUESTION_ID_DESCRIPTION, content = @Content)
    })
    @DeleteMapping(QuestionController.ROOT_ROUTE + "/{id}")
    public void delete(@PathVariable("id") @Positive Integer id) {
        this.questionService.deleteQuestion(id);
    }


}
