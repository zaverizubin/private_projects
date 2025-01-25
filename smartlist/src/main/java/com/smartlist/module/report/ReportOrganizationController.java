package com.smartlist.module.report;

import com.smartlist.enums.AssessmentStatus;
import com.smartlist.module.report.dto.response.*;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@Tag(name = "Report-Organization", description = "Report-Organization API")
@RequestMapping(value ="/report/organization/", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
@Secured({"SUPERADMIN", "ADMIN", "MEMBER"})
public class ReportOrganizationController {

    private final ReportOrganizationService reportOrganizationService;

    ReportOrganizationController(final ReportOrganizationService reportOrganizationService){
        this.reportOrganizationService = reportOrganizationService;
    }

    @Operation(summary = "Get high level summary by organization and date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = HighLevelSummaryRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_DATE_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content),
    })
    @GetMapping("{organizationId}/highlevel/summary")
    public HighLevelSummaryRespDTO getOrganizationHighLevelSummary(
            @PathVariable("organizationId") @Positive Integer organizationId,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to
            ){
        return this.reportOrganizationService.getHighLevelSummary(organizationId, from, to);
    }

    @Operation(summary = "Get rate summary for organization by date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = RateSummaryRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_DATE_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content),
    })
    @GetMapping("{organizationId}/rate/summary")
    public RateSummaryRespDTO getOrganizationRateSummary(
            @PathVariable("organizationId") @Positive Integer organizationId,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to
            ) {
        return this.reportOrganizationService.getRateSummary(organizationId, from, to);
    }

    @Operation(summary = "Get assessment summaries for organization by status and date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AssessmentSummaryRespDTO.class)))}),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_DATE_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_ASSESSMENT_STATUS_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content),
    })
    @GetMapping("{organizationId}/assessment/summary")
    public List<AssessmentSummaryRespDTO> getAllAssessmentSummaryByStatus(
            @PathVariable("organizationId") @Positive Integer organizationId,
            @RequestParam("status") @NotNull AssessmentStatus status,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to
            ) {
        return this.reportOrganizationService.getAllAssessmentSummaryByStatus(organizationId, status, from, to);
    }

    @Operation(summary = "Get assessment decision summaries by organization")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AssessmentSummaryRespDTO.class)))}),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_ASSESSMENT_STATUS_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content),
    })
    @GetMapping("{organizationId}/decision/summary")
    public List<AssessmentDecisionSummaryRespDTO> getAssessmentDecisionSummariesForOrganizationByStatus(
            @PathVariable("organizationId") @Positive Integer organizationId,
            @RequestParam("status") @NotNull AssessmentStatus status) {
        return this.reportOrganizationService.getAssessmentDecisionSummariesForOrganizationByStatus(organizationId, status);
    }

    @Operation(summary = "Time series data for assessments by organization and date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = TimeSeriesSummaryRespDTO.class))}),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_DATE_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content),
    })
    @GetMapping("{organizationId}/timeseries/data")
    public TimeSeriesSummaryRespDTO getTimeSeriesSummaryForOrganization(
            @PathVariable("organizationId") @Positive Integer organizationId,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to) {
        return this.reportOrganizationService.getTimeSeriesSummaryForOrganization(organizationId, from, to);
    }


}
