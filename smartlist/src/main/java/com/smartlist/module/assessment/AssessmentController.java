package com.smartlist.module.assessment;

import com.smartlist.module.assessment.dto.response.AssessmentRespDTO;
import com.smartlist.module.assessment.dto.response.AssessmentStatusCountRespDTO;
import com.smartlist.enums.AssessmentStatus;
import com.smartlist.module.assessment.dto.request.AssessmentReqDTO;
import com.smartlist.module.assessment.dto.request.DuplicateAssessmentForOrganizationsReqDTO;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import java.util.List;

/*
Refer : https://www.dariawan.com/tutorials/spring/documenting-spring-boot-rest-api-springdoc-openapi-3/
 */
@RestController
@Tag(name = "Assessment", description = "Assessment API")
@RequestMapping(value ="", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
@Secured({"SUPERADMIN", "ADMIN", "MEMBER"})
public class AssessmentController {

    private static final String ROOT_ROUTE = "/assessment";

    private final AssessmentService assessmentService;

    @Autowired
    AssessmentController(final AssessmentService assessmentService){
        this.assessmentService = assessmentService;
    }

    @Operation(summary = "Get list of assessments for organization and status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AssessmentRespDTO.class))) }),
        @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
        @ApiResponse(responseCode = "400", description = AssessmentResponseCodes.ASSESSMENT_NAME_EXISTS_DESCRIPTION, content = @Content),
        @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("/organization/{id}" + AssessmentController.ROOT_ROUTE + "/{status}")
    public ResponseEntity<List<AssessmentRespDTO>> getAllByOrganization(
            @Parameter(description="Id of the organization. Cannot be empty.", required=true)
            @PathVariable ("id") @Positive Integer id,

            @Parameter(description="Assessment Status. Cannot be empty.", required=true)
            @PathVariable("status") AssessmentStatus type) {
        return new ResponseEntity<>(this.assessmentService.getAllForOrganization(id, type), HttpStatus.OK);
    }



    @Secured({"SUPERADMIN", "ADMIN", "MEMBER", "CANDIDATE"})
    @Operation(summary = "Get assessment by Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AssessmentRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping(value = AssessmentController.ROOT_ROUTE + "/{id}")
    public ResponseEntity<AssessmentRespDTO> getById(
            @Parameter(description="Assessment Id. Cannot be empty.", required=true)
            @PathVariable("id") @Positive Integer id) {
        return new ResponseEntity<>(this.assessmentService.getAssessmentById(id), HttpStatus.OK);
    }



    @Secured({"SUPERADMIN", "ADMIN", "MEMBER", "CANDIDATE"})
    @Operation(summary = "Get assessment by token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AssessmentRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ASSESSMENT_TOKEN_DESCRIPTION, content = @Content)
    })
    @GetMapping(AssessmentController.ROOT_ROUTE + "/token/{token}")
    public ResponseEntity<AssessmentRespDTO> getByToken(
            @Parameter(description="Assessment token. Cannot be empty.", required=true)
            @PathVariable("token") @NotBlank String token) {
        return new ResponseEntity<>(this.assessmentService.getAssessmentByToken(token), HttpStatus.OK);
    }




    @Operation(summary = "Publish assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = AssessmentResponseCodes.ASSESSMENT_ACTION_DENIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = AssessmentResponseCodes.INVALID_ASSESSMENT_BLOCK_COUNT_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = AssessmentResponseCodes.INVALID_QUESTION_COUNT_DESCRIPTION, content = @Content)
    })
    @PatchMapping(AssessmentController.ROOT_ROUTE + "/{id}/publish")
    public void publish(
            @Parameter(description="Assessment Id. Cannot be empty.", required=true)
            @PathVariable("id") @Positive Integer id) {
        this.assessmentService.publishAssessment(id);
    }




    @Operation(summary = "Create assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_HEADER_FILE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content)
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(AssessmentController.ROOT_ROUTE)
    public Integer create(
                    @Parameter(description="Assessment to Create. Cannot be null or empty.", required=true, schema=@Schema(implementation = AssessmentReqDTO.class))
                    @Valid @RequestBody AssessmentReqDTO createAssessmentReqDTO) {
        return this.assessmentService.createAssessment(createAssessmentReqDTO);
    }




    @Operation(summary = "Update assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_HEADER_FILE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "405", description = "Validation exception")
    })
    @PutMapping(AssessmentController.ROOT_ROUTE + "/{id}")
    public void update(
            @Parameter(description="Assessment Id. Cannot be empty.", required=true)
            @PathVariable("id") @Positive Integer id,

            @Parameter(description="Assessment to Update. Cannot null or empty.", required=true, schema=@Schema(implementation = AssessmentReqDTO.class))
            @Valid @RequestBody AssessmentReqDTO assessmentDto) {
        this.assessmentService.updateAssessment(id, assessmentDto);
    }




    @Operation(summary = "Delete assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @DeleteMapping(AssessmentController.ROOT_ROUTE + "/{id}")
    public void delete(
            @Parameter(description="Assessment Id. Cannot be empty.", required=true)
            @PathVariable("id") @Positive Integer id) {
        this.assessmentService.deleteAssessment(id);
    }




    @Operation(summary = "Activate assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping(AssessmentController.ROOT_ROUTE + "/{id}/activate")
    public void activate(
            @Parameter(description="Assessment Id. Cannot be empty.", required=true)
            @PathVariable("id") @Positive Integer id) {
        this.assessmentService.setAssessmentActive(id, true);
    }




    @Operation(summary = "Deactivate assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping(AssessmentController.ROOT_ROUTE + "/{id}/deactivate")
    public void deactivate(
            @Parameter(description="Assessment Id. Cannot be empty.", required=true)
            @PathVariable("id") @Positive Integer id) {
        this.assessmentService.setAssessmentActive(id, false);
    }




    @Operation(summary = "Duplicate assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class)) } ),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @PostMapping(AssessmentController.ROOT_ROUTE + "/{id}/duplicate")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Integer> duplicate(
            @Parameter(description="Assessment Id. Cannot be empty.", required=true)
            @PathVariable("id") @Positive Integer id) {
        return new ResponseEntity<>(this.assessmentService.duplicateAssessment(null, id), HttpStatus.OK) ;
    }




    @Operation(summary = "Search assessments by status and name for an organization")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AssessmentRespDTO.class))) } ),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = AssessmentResponseCodes.INVALID_ASSESSMENT_STATUS_DESCRIPTION, content = @Content)
    })
    @GetMapping(AssessmentController.ROOT_ROUTE)
    public List<AssessmentRespDTO> search(
            @Parameter(description="Organization Id. Cannot be empty.", required=true)
            @RequestParam("organizationId") Integer organizationId,

            @Parameter(description="Assessment name. Cannot be empty.", required=true)
            @RequestParam("name") String name,

            @Parameter(description="Assessment status. Cannot be empty.", required=true)
            @RequestParam("status") AssessmentStatus status) {
        return this.assessmentService.searchByStatusAndNameForOrganization(organizationId, name, status);
    }

    @Operation(summary = "Get Assessment status count for an organization")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AssessmentStatusCountRespDTO.class)) } ),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping(AssessmentController.ROOT_ROUTE + "/organization/{organizationId}/status/count")
    public AssessmentStatusCountRespDTO getAssessmentStatusCount(
            @Parameter(description="Organization Id. Cannot be empty.", required=true)
            @PathVariable("organizationId") Integer organizationId) {
        return this.assessmentService.getAssessmentStatusCount(organizationId);
    }

    @Secured({"SUPERADMIN"})
    @Operation(summary = "Duplicate assessment for organizations")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "405", description = "Validation exception")
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(AssessmentController.ROOT_ROUTE + "/duplicate")
    public void duplicateAssessmentAtOrganizationLevel(
            @Parameter(description="Assessment to Duplicate. Cannot null or empty.", required=true, schema=@Schema(implementation = DuplicateAssessmentForOrganizationsReqDTO.class))
            @Valid @RequestBody() DuplicateAssessmentForOrganizationsReqDTO duplicateAssessmentForOrganizationsReqDto) {
        this.assessmentService.duplicateAssessmentForOrganizations(duplicateAssessmentForOrganizationsReqDto);
    }

}
