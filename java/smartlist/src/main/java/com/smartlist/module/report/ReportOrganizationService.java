package com.smartlist.module.report;

import com.smartlist.enums.AssessmentStatus;
import com.smartlist.model.Organization;
import com.smartlist.module.organization.OrganizationRepository;
import com.smartlist.module.report.dto.response.*;
import com.smartlist.module.report.records.ReportData5;
import com.smartlist.module.report.records.ReportData6;
import com.smartlist.module.report.records.ReportData7;
import com.smartlist.module.report.records.ReportData8;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReportOrganizationService {

    private final ReportOrganizationRepository reportOrganizationRepository;
    private final OrganizationRepository organizationRepository;

    public ReportOrganizationService(final ReportOrganizationRepository reportOrganizationRepository,
                                     final OrganizationRepository organizationRepository){
        this.reportOrganizationRepository = reportOrganizationRepository;
        this.organizationRepository = organizationRepository;
    }

    public HighLevelSummaryRespDTO getHighLevelSummary(final Integer organizationId,
                                                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        findOrganizationOrThrow(organizationId);

        Long uniqueAssessments = this.reportOrganizationRepository.getCountAttempted(organizationId, from, to);
        Long candidateSubmissions = this.reportOrganizationRepository.getCountCompleted(organizationId, from, to);
        Long smartListed = this.reportOrganizationRepository.getCountSmartListed(organizationId, from, to);

        return new HighLevelSummaryRespDTO(uniqueAssessments, candidateSubmissions, smartListed);
    }

    public RateSummaryRespDTO getRateSummary(final Integer organizationId,
                                             @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                             @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        findOrganizationOrThrow(organizationId);

        HighLevelSummaryRespDTO highLevelSummaryRespDto = getHighLevelSummary(organizationId, from, to);

        Long candidatesMeetingBasicCriteria = this.reportOrganizationRepository.getCountMeetingBasicRequirements(organizationId, from, to);
        Long registrationCount = this.reportOrganizationRepository.getCountRegistered(organizationId);

        Long responseRate = (highLevelSummaryRespDto.getCandidateSubmissions() * 100) / highLevelSummaryRespDto.getUniqueAssessments();
        Long qualificationRate = (candidatesMeetingBasicCriteria * 100) / highLevelSummaryRespDto.getCandidateSubmissions();
        Long smartlistRate = (highLevelSummaryRespDto.getCandidatesSmartListed() * 100) / highLevelSummaryRespDto.getCandidateSubmissions();

        return new RateSummaryRespDTO(responseRate, qualificationRate, smartlistRate, registrationCount);
    }

    public List<AssessmentSummaryRespDTO> getAllAssessmentSummaryByStatus(final Integer organizationId, final AssessmentStatus status,
                                                                          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                                                          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        findOrganizationOrThrow(organizationId);
        throwIfAssesmentStatusInvalid(status);

        List<AssessmentSummaryRespDTO> assessmentSummaryRespDTOList = new ArrayList<>();
        List<ReportData5> reportDataList = this.reportOrganizationRepository.getAllAssessmentSummaryByStatus(organizationId, status, from, to);
        for (ReportData5 reportData: reportDataList) {
            assessmentSummaryRespDTOList.add(new AssessmentSummaryRespDTO(reportData));
        }

        return assessmentSummaryRespDTOList;
    }

    public List<AssessmentDecisionSummaryRespDTO> getAssessmentDecisionSummariesForOrganizationByStatus(final Integer organizationId,
                                                                                                        final AssessmentStatus status) {
        findOrganizationOrThrow(organizationId);
        throwIfAssesmentStatusInvalid(status);

        List<AssessmentDecisionSummaryRespDTO> arrData = new ArrayList<>();
        List<ReportData6> rawDataAssessmentDecision =
                this.reportOrganizationRepository.getAssessmentDecisionSummariesForOrganizationByStatus(organizationId, status);
        List<ReportData7> rawDataAssessmentStatus =
                this.reportOrganizationRepository.getAssessmentStatusSummariesForOrganizationByStatus(organizationId, status);

        for(ReportData6 data1 : rawDataAssessmentDecision){
            for(ReportData7 data2: rawDataAssessmentStatus){
                if(data1.getAssessmentId().equals(data2.getAssessmentId())){
                    arrData.add(new AssessmentDecisionSummaryRespDTO(data1, data2));
                }
            }
        }

        return arrData;
    }

    public TimeSeriesSummaryRespDTO getTimeSeriesSummaryForOrganization(final Integer organizationId,
                                                                        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                                                        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        findOrganizationOrThrow(organizationId);

        List<TimeSeriesDataRespDTO> arrCountOfAttempts = new ArrayList<>();
        List<TimeSeriesDataRespDTO> arrCountOfSubmissions = new ArrayList<>();

        List<ReportData8> rawData = this.reportOrganizationRepository.getTimeSeriesCountRegisteredByDate(organizationId, from, to);

        for (ReportData8 data: rawData) {
            arrCountOfAttempts.add(new TimeSeriesDataRespDTO(data));
        }

        rawData = this.reportOrganizationRepository.getTimeSeriesCountSubmittedByDate(organizationId, from, to);
        for (ReportData8 data: rawData) {
            arrCountOfSubmissions.add(new TimeSeriesDataRespDTO(data));
        }

        return new TimeSeriesSummaryRespDTO(arrCountOfAttempts, arrCountOfSubmissions);
    }

    private Organization findOrganizationOrThrow(final Integer organizationId){
        Optional<Organization> optionalOrganization = this.organizationRepository.findById(organizationId);
        return optionalOrganization.orElseThrow(() -> ReportResponseCodes.INVALID_ORGANIZATION_ID);
    }

    private void throwIfAssesmentStatusInvalid(final AssessmentStatus status) {
        if (status != AssessmentStatus.ACTIVE && status != AssessmentStatus.ARCHIVED) {
            throw ReportResponseCodes.INVALID_ASSESSMENT_STATUS;
        }
    }
}
