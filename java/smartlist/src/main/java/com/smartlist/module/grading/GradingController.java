package com.smartlist.module.grading;

import com.smartlist.module.grading.dto.request.QuestionCommentReqDTO;
import com.smartlist.module.grading.dto.request.QuestionScoreReqDTO;
import com.smartlist.module.grading.dto.response.AssessmentQuestionScoreRespDTO;
import com.smartlist.module.grading.dto.response.QuestionCommentRespDTO;
import com.smartlist.enums.AssessmentDecision;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Grading", description = "Grading API")
@RequestMapping(value ="/grading/", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
@Secured({"SUPERADMIN", "ADMIN", "MEMBER"})
public class GradingController {

    private final GradingService gradingService;

    GradingController(final GradingService gradingService){
        this.gradingService = gradingService;
    }

    @Operation(summary = "Get candidate question scores for assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AssessmentQuestionScoreRespDTO.class)))  }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("candidate/{candidateId}/assessment/{assessmentId}/score")
    public List<AssessmentQuestionScoreRespDTO> getCandidateScoresByAssessment(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("assessmentId") @Positive Integer assessmentId) {
        return this.gradingService.getCandidateScoresByAssessment(candidateId, assessmentId);
    }

    @Operation(summary = "Get candidate question scores for assessment block")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AssessmentQuestionScoreRespDTO.class)))  }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("candidate/{candidateId}/assessment-block/{assessmentBlockId}/score")
    public List<AssessmentQuestionScoreRespDTO> getCandidateScoresByAssessmentBlock(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("assessmentBlockId") @Positive Integer assessmentBlockId){
        return this.gradingService.getCandidateScoresByAssessmentBlock(candidateId, assessmentBlockId);
    }

    @Operation(summary = "Get candidate unscored questions for assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = Integer.class))) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("candidate/{candidateId}/assessment/{assessmentId}/question/unscored")
    public List<Integer> getCandidateUnScoredQuestionsForAssessment(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("assessmentId") @Positive Integer assessmentId) {
        return  this.gradingService.getCandidateUnScoredQuestionsForAssessment(candidateId, assessmentId);
    }

    @Operation(summary = "Get candidate question comments")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = QuestionCommentRespDTO.class))) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_QUESTION_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("candidate/{candidateId}/question/{questionId}/comment")
    public List<QuestionCommentRespDTO> getCandidateQuestionComments(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("questionId") @Positive Integer questionId
            ) {
        return  this.gradingService.getCandidateQuestionComments(candidateId, questionId);
    }

    @Operation(summary = "Submit candidate question comments")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_QUESTION_ID_DESCRIPTION, content = @Content)
    })
    @PutMapping("candidate/{candidateId}/question/{questionId}/comment")
    public void saveCandidateQuestionComment(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("questionId") @Positive Integer questionId,
            @RequestBody() @Valid QuestionCommentReqDTO questionCommentReqDto) {
       this.gradingService.saveCandidateQuestionComment(candidateId, questionId, questionCommentReqDto);
    }

    @Operation(summary = "Submit candidate question score")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_QUESTION_ID_DESCRIPTION, content = @Content)
    })
    @PutMapping("candidate/{candidateId}/score")
    public void saveCandidateResponseScore(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @RequestBody() @Valid QuestionScoreReqDTO questionScoreReqDto) {
        this.gradingService.saveCandidateResponseScore(candidateId, questionScoreReqDto);
    }

    @Operation(summary = "Mark assessment grading complete")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping("candidate/{candidateId}/assessment/{assessmentId}/grading/complete")
    public void markCandidateAssessmentGradingComplete(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("assessmentId") @Positive Integer assessmentId
    ) {
        this.gradingService.markCandidateAssessmentGradingComplete(candidateId, assessmentId);
    }

    @Operation(summary = "Get candidate assessment decision")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AssessmentDecision.class))} ),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("candidate/{candidateId}/assessment/{assessmentId}/decision")
    public AssessmentDecision getCandidateAssessmentDecision(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("assessmentId") @Positive Integer assessmentId){
        return this.gradingService.getCandidateAssessmentDecision(candidateId, assessmentId);
    }

    @Operation(summary = "Set candidate assessment decision")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = GradingResponseCodes.INVALID_ASSESSMENT_DECISION_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = GradingResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @PutMapping("candidate/{candidateId}/assessment/{assessmentId}/decision/{decision}")
    public void setCandidateAssessmentDecision(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("assessmentId") @Positive Integer assessmentId,
            @PathVariable("decision") @NotEmpty String decision) {
        this.gradingService.setCandidateAssessmentDecision(candidateId, assessmentId, decision);
    }

}
