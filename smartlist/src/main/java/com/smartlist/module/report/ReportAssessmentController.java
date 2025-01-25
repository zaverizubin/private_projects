package com.smartlist.module.report;

import com.smartlist.module.report.dto.response.*;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@Tag(name = "Report-Assessment", description = "Report-Assessment API")
@RequestMapping(value ="/report/assessment/", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
@Secured({"SUPERADMIN", "ADMIN", "MEMBER"})
public class ReportAssessmentController {

    private final ReportAssessmentService reportAssessmentService;

    ReportAssessmentController(final ReportAssessmentService reportAssessmentService){
        this.reportAssessmentService = reportAssessmentService;
    }

    @Operation(summary = "Get high level summary by  assessment and date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = HighLevelSummaryRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_DATE_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{assessmentId}/highlevel/summary")
    public HighLevelSummaryRespDTO getAssessmentHighLevelSummary(
            @PathVariable("assessmentId") @Positive Integer assessmentId,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to){
        return this.reportAssessmentService.getHighLevelSummary(assessmentId, from, to);
    }

    @Operation(summary = "Get rate summary for assessment by date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = RateSummaryRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_DATE_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{assessmentId}/rate/summary")
    public RateSummaryRespDTO getAssessmentRateSummary(
            @PathVariable("assessmentId") Integer assessmentId,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to) {
        return  this.reportAssessmentService.getRateSummary(assessmentId, from, to);
    }

    @Operation(summary = "Get assessment status summary count")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AssessmentStatusSummaryRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_DATE_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{assessmentId}/status/summary")
    public AssessmentStatusSummaryRespDTO getAssessmentStatusSummary(
            @PathVariable("assessmentId") Integer assessmentId,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to) {
        return this.reportAssessmentService.getAssessmentStatusSummary(assessmentId, from, to);
    }

    @Operation(summary = "Get assessment block average score for assessment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AssessmentBlockAverageScoreRespDTO.class))) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_DATE_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{assessmentId}/assessment-block/average-score")
    public List<AssessmentBlockAverageScoreRespDTO> getAssessmentBlockAverageScore(
            @PathVariable("assessmentId") Integer assessmentId,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to) {
        return  this.reportAssessmentService.getAssessmentBlockAverageScore(assessmentId, from, to);
    }

    @Operation(summary = "Get assessment performance details for all candidates")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AssessmentCandidatePerformanceRespDTO.class))) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_DATE_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{assessmentId}/candidate/performance")
    public List<AssessmentCandidatePerformanceRespDTO> getAssessmentPerformanceDetailsForAllCandidates(
            @PathVariable("assessmentId") Integer assessmentId,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to) {
        return this.reportAssessmentService.getAssessmentPerformanceForAllCandidates(assessmentId, from, to);
    }

    @Operation(summary = "Get assessment block performance details for all candidates")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AssessmentBlockCandidatePerformanceRespDTO.class))) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = ReportResponseCodes.INVALID_DATE_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("assessment-block/{assessmentBlockId}/candidate/performance")
    public List<AssessmentBlockCandidatePerformanceRespDTO> getAssessmentBlockPerformanceDetailsForAllCandidates(
            @PathVariable("assessmentBlockId") Integer assessmentBlockId,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to){
        return this.reportAssessmentService.getAssessmentBlockPerformanceForAllCandidates(assessmentBlockId, from, to);
    }

    @Operation(summary = "Time series data for assessment by date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = TimeSeriesSummaryRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{assessmentId}/timeseries/data")
    public TimeSeriesSummaryRespDTO getTimeSeriesSummaryForOrganization(
            @PathVariable("assessmentId") Integer assessmentId,
            @RequestParam("from") @PastOrPresent LocalDate from,
            @RequestParam("to") @PastOrPresent LocalDate to) {
        return this.reportAssessmentService.getTimeSeriesSummaryForAssessment(assessmentId, from, to);
    }


}
