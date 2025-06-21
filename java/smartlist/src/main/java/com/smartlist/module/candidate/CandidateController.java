package com.smartlist.module.candidate;

import com.smartlist.module.auth.dto.response.AuthRespDTO;
import com.smartlist.module.candidate.dto.request.CreateCandidateReqDTO;
import com.smartlist.module.candidate.dto.request.SubmitAnswerReqDTO;
import com.smartlist.module.candidate.dto.request.UpdateCandidateProfileReqDTO;
import com.smartlist.module.candidate.dto.response.CandidateAssessmentIntroRespDTO;
import com.smartlist.module.candidate.dto.response.CandidateAssessmentRespDTO;
import com.smartlist.module.candidate.dto.response.CandidateRespDTO;
import com.smartlist.module.candidate.dto.response.CandidateResponseRespDTO;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Candidate", description = "Candidate API")
@RequestMapping(value ="", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
@Secured({"CANDIDATE"})
public class CandidateController {

    private static final String ROOT_ROUTE = "/candidate";

    private final CandidateService candidateService;

    @Autowired
    CandidateController(final CandidateService candidateService){
        this.candidateService = candidateService;
    }

    @Operation(summary = "Get assessment introduction by assessment token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = CandidateAssessmentIntroRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN_DESCRIPTION, content = @Content)
    })
    @GetMapping(CandidateController.ROOT_ROUTE + "/assessment/token/{token}/intro")
    public CandidateAssessmentIntroRespDTO getCandidateAssessmentIntro(@PathVariable("token") @NotBlank String token){
        return this.candidateService.getCandidateAssessmentIntro(token);
    }

    @Operation(summary = "Create candidate")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = CandidateResponseCodes.CANDIDATE_EXISTS_DESCRIPTION, content = @Content)
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(CandidateController.ROOT_ROUTE)
    public Integer create(@RequestBody() @Valid CreateCandidateReqDTO createCandidateReqDto) {
        return this.candidateService.createCandidate(createCandidateReqDto);
    }


    @Operation(summary = "Send OTP")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = CandidateResponseCodes.CANDIDATE_ALREADY_VERIFIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping(CandidateController.ROOT_ROUTE + "/{id}/send-verification-code")
    public void resendOTP(@PathVariable("id") @Positive Integer id) {
        this.candidateService.sendCandidateOTP(id);
    }

    @Operation(summary = "Update candidate profile")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_PHOTO_FILE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_VIDEO_FILE_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping(CandidateController.ROOT_ROUTE + "/{id}/profile")
    public void updateProfile(@PathVariable("id") @Positive Integer id, @RequestBody() @Valid UpdateCandidateProfileReqDTO updateCandidateProfileReqDto) {
        this.candidateService.updateCandidateProfile(id, updateCandidateProfileReqDto);
    }

    @Operation(summary = "Get candidate by contact number")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = CandidateRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_CONTACT_NUMBER_DESCRIPTION, content = @Content)
    })
    @GetMapping(CandidateController.ROOT_ROUTE + "/contact-number/{contactNumber}")
    public CandidateRespDTO getByContactNumber(@PathVariable("contactNumber") @NotBlank String contactNumber) {
        return this.candidateService.getCandidateByContactNumber(contactNumber);
    }

    @Secured({"SUPERADMIN", "ADMIN", "MEMBER", "CANDIDATE"})
    @Operation(summary = "Get candidate by Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = CandidateRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping(CandidateController.ROOT_ROUTE + "/{id}")
    public CandidateRespDTO get(@PathVariable("id") @Positive Integer id){
        return  this.candidateService.getCandidateById(id);
    }

    @Operation(summary = "Create candidate assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = CandidateResponseCodes.CANDIDATE_ASSESSMENT_EXISTS_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = CandidateResponseCodes.ASSESSMENT_ACTION_DENIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN_DESCRIPTION, content = @Content)

    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(CandidateController.ROOT_ROUTE + "/{id}/assessment/token/{token}")
    public Integer createAssessment(@PathVariable("id") @Positive Integer id, @PathVariable("token") @NotEmpty String token) {
        return this.candidateService.createCandidateAssessment(id, token);
    }

    @Secured({"ADMIN", "MEMBER"})
    @Operation(summary = "Search candidates by name and organization")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = CandidateRespDTO.class))) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("/organization/{organizationId}" + CandidateController.ROOT_ROUTE)
    public List<CandidateRespDTO> search(@PathVariable("organizationId") @Positive Integer organizationId, @RequestParam("name") @NotBlank String name) {
        return this.candidateService.getCandidateByNameForOrganization(organizationId, name);
    }

    @Operation(summary = "Get candidate assessment by assessment token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = CandidateAssessmentRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = CandidateResponseCodes.CANDIDATE_ASSESSMENT_TIMED_OUT_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS_DESCRIPTION, content = @Content)
    })
    @GetMapping(CandidateController.ROOT_ROUTE + "/{id}/assessment/token/{token}")
    public CandidateAssessmentRespDTO getCandidateAssessmentByToken(@PathVariable("id") @Positive Integer id, @PathVariable("token") @NotBlank String token) {
        return this.candidateService.getCandidateAssessmentByToken(id, token);
    }

    @Secured({"SUPERADMIN", "ADMIN", "MEMBER", "CANDIDATE"})
    @Operation(summary = "Get candidate assessment by assessment id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = CandidateAssessmentRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = CandidateResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS_DESCRIPTION, content = @Content)
    })
    @GetMapping(CandidateController.ROOT_ROUTE + "/{id}/assessment/{assessmentId}")
    public CandidateAssessmentRespDTO getCandidateAssessmentByAssessmentId(
            @PathVariable("id") @Positive Integer id,
            @PathVariable("assessmentId") @Positive Integer assessmentId){
        return this.candidateService.getCandidateAssessmentByAssessmentId(id, assessmentId);
    }


    @Operation(summary = "Log candidate assessment attempt")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(CandidateController.ROOT_ROUTE + "/{id}/assessment/{assessmentId}/attempt/log")
    public void logAssessmentAttempt(@PathVariable("id") @Positive Integer id, @PathVariable("assessmentId") @Positive Integer assessmentId) {
        this.candidateService.logAssessmentAttempt(id, assessmentId);
    }

    @Operation(summary = "Submit answer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = CandidateResponseCodes.ANSWER_RESPONSE_INCORRECT_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_QUESTION_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_ANSWER_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_VIDEO_FILE_ID_DESCRIPTION, content = @Content)
    })
    @PutMapping(CandidateController.ROOT_ROUTE + "/candidate-assessment/{candidateAssessmentId}/question/{questionId}/submit-answer")
    public void submitAnswer(
            @PathVariable("candidateAssessmentId") @Positive Integer candidateAssessmentId,
            @PathVariable("questionId") @Positive Integer questionId,
            @RequestBody() @Valid SubmitAnswerReqDTO submitAnswerReqDto) {
       this.candidateService.submitAnswer(candidateAssessmentId, questionId, submitAnswerReqDto);
    }

    @Operation(summary = "Set active assessment block")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping(CandidateController.ROOT_ROUTE + "/candidate-assessment/{candidateAssessmentId}/assessment-block/{assessmentBlockId}/active")
    public void setActiveAssessmentBlock(
            @PathVariable("candidateAssessmentId") @Positive Integer candidateAssessmentId,
            @PathVariable("assessmentBlockId") @Positive Integer assessmentBlockId) {
        this.candidateService.setActiveAssessmentBlock(candidateAssessmentId, assessmentBlockId);
    }

    @Operation(summary = "Mark assessment complete")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping(CandidateController.ROOT_ROUTE + "/candidate-assessment/{candidateAssessmentId}/complete")
    public void markAssessmentComplete(@PathVariable("candidateAssessmentId") @Positive Integer candidateAssessmentId) {
        this.candidateService.markCandidateAssessmentComplete(candidateAssessmentId);
    }

    @Secured({"ADMIN", "MEMBER", "CANDIDATE"})
    @Operation(summary = "Get candidate responses for question")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = CandidateResponseRespDTO.class))) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_QUESTION_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping(CandidateController.ROOT_ROUTE + "/candidate-assessment/{candidateAssessmentId}/question/{questionId}/candidate-response")
    public List<CandidateResponseRespDTO> getResponsesForQuestion(
            @PathVariable("candidateAssessmentId") @Positive Integer candidateAssessmentId,
            @PathVariable("questionId") @Positive Integer questionId) {
        return  this.candidateService.getResponsesByQuestionId(candidateAssessmentId, questionId);
    }


}
