package com.smartlist.module.report;

import com.smartlist.module.report.dto.response.AssessmentStatusSummaryRespDTO;
import com.smartlist.module.report.dto.response.CandidateAssessmentReportRespDTO;
import com.smartlist.module.report.dto.response.HighLevelSummaryRespDTO;
import com.smartlist.module.report.dto.response.RateSummaryRespDTO;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Report-Candidate", description = "Report-Candidate API")
@RequestMapping(value ="/report/candidate/", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
@Secured({"SUPERADMIN", "ADMIN", "MEMBER"})
public class ReportCandidateController {

    private final ReportCandidateService reportCandidateService;

    ReportCandidateController(final ReportCandidateService reportCandidateService){
        this.reportCandidateService = reportCandidateService;
    }

    @Operation(summary = "Get candidate assessment report")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = HighLevelSummaryRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{candidateId}/assessment/{assessmentId}")
    public CandidateAssessmentReportRespDTO getCandidateScoreForAssessmentBlocks(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("assessmentId") @Positive Integer assessmentId){
        return this.reportCandidateService.getCandidateAssessmentReport(candidateId, assessmentId);
    }

    @Operation(summary = "Get candidate assessment report PDF")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = RateSummaryRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{candidateId}/assessment/{assessmentId}/pdf")
    public ResponseEntity<byte[]> downloadCandidateAssessmentReport(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("assessmentId") @Positive Integer assessmentId) {
        return this.reportCandidateService.getCandidateAssessmentReportAsPDF(candidateId, assessmentId);
    }

    @Operation(summary = "Send candidate assessment report by mail")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AssessmentStatusSummaryRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_CANDIDATE_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = ReportResponseCodes.INVALID_ASSESSMENT_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{candidateId}/assessment/{assessmentId}/mail")
    public void getAssessmentStatusSummary(
            @PathVariable("candidateId") @Positive Integer candidateId,
            @PathVariable("assessmentId") @Positive Integer assessmentId) {
        this.reportCandidateService.sendCandidateAssessmentReportMail(candidateId, assessmentId);
    }





}
