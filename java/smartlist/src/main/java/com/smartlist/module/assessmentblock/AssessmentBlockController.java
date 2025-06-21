package com.smartlist.module.assessmentblock;

import com.smartlist.module.assessmentblock.dto.request.AssessmentBlockReqDTO;
import com.smartlist.module.assessmentblock.dto.request.ReorderReqDTO;
import com.smartlist.module.assessmentblock.dto.response.AssessmentBlockRespDTO;
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
@Tag(name = "AssessmentBlock", description = "AssessmentBlock API")
@RequestMapping(value ="", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
@Secured({"SUPERADMIN", "ADMIN", "MEMBER"})
public class AssessmentBlockController {

    private static final String ROOT_ROUTE = "assessment-block";

    private final AssessmentBlockService assessmentBlockService;

    AssessmentBlockController(final AssessmentBlockService assessmentBlockService){
        this.assessmentBlockService = assessmentBlockService;
    }

    @Secured({"SUPERADMIN", "ADMIN", "MEMBER", "CANDIDATE"})
    @Operation(summary = "Get assessment blocks for assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AssessmentBlockRespDTO.class))) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentBlockResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("assessment/{id}/" + AssessmentBlockController.ROOT_ROUTE)
    public List<AssessmentBlockRespDTO> getAll(@PathVariable ("id") @Positive Integer assessmentId) {
        return this.assessmentBlockService.getAllByAssessmentId(assessmentId);
    }

    @Secured({"SUPERADMIN", "ADMIN", "MEMBER", "CANDIDATE"})
    @Operation(summary = "Get assessment block")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AssessmentBlockRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping(AssessmentBlockController.ROOT_ROUTE + "/{id}")
    public AssessmentBlockRespDTO get(@PathVariable("id") @Positive Integer id) {
        return this.assessmentBlockService.getAssessmentBlockById(id);
    }


    @Operation(summary = "Create an assessment block")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentBlockResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("assessment/{id}/" + AssessmentBlockController.ROOT_ROUTE)
    public Integer create(@PathVariable("id") @Positive Integer id, @RequestBody() @Valid AssessmentBlockReqDTO createAssessmentBlockReqDTO) {
        return this.assessmentBlockService.createAssessmentBlock(id, createAssessmentBlockReqDTO);
    }


    @Operation(summary = "Update an assessment block")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = AssessmentBlockResponseCodes.ASSESSMENT_BLOCK_ACTION_DENIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)
    })
    @PutMapping(AssessmentBlockController.ROOT_ROUTE + "/{id}")
    public void update(@PathVariable("id") @Positive Integer id, @RequestBody() @Valid AssessmentBlockReqDTO updateAssessmentBlockReqDTO) {
        this.assessmentBlockService.updateAssessmentBlock(id, updateAssessmentBlockReqDTO);
    }


    @Operation(summary = "Reorder assessment blocks")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentBlockResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping("assessment/{id}/" + AssessmentBlockController.ROOT_ROUTE + "/reorder")
    public void reorder(@PathVariable("id") @Positive Integer id, @RequestBody() @Valid ReorderReqDTO reorderReqDto) {
        this.assessmentBlockService.reorderAssessmentBlock(id,reorderReqDto);
    }


    @Operation(summary = "Delete assessment block")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)
    })
    @DeleteMapping(AssessmentBlockController.ROOT_ROUTE + "/{id}")
    public void delete(@PathVariable("id") @Positive Integer id) {
        this.assessmentBlockService.deleteAssessmentBlock(id);
    }

}
