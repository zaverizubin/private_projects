package com.smartlist.module.report;

import com.smartlist.enums.CandidateAssessmentStatus;
import com.smartlist.model.Assessment;
import com.smartlist.model.AssessmentBlock;
import com.smartlist.module.assessment.AssessmentRepository;
import com.smartlist.module.assessmentblock.AssessmentBlockRepository;
import com.smartlist.module.candidate.CandidateAssessmentRepository;
import com.smartlist.module.report.dto.response.*;
import com.smartlist.module.report.records.ReportData1;
import com.smartlist.module.report.records.ReportData2;
import com.smartlist.module.report.records.ReportData3;
import com.smartlist.module.report.records.ReportData8;
import org.modelmapper.ModelMapper;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ReportAssessmentService {

    private final AssessmentBlockRepository assessmentBlockRepository;
    private final AssessmentRepository assessmentRepository;
    private final CandidateAssessmentRepository candidateAssessmentRepository;
    private final ReportAssessmentRepository reportAssessmentRepository;
    private final ReportCandidateService reportCandidateService;
    private final ModelMapper modelMapper;

    public ReportAssessmentService(final AssessmentBlockRepository assessmentBlockRepository, final AssessmentRepository assessmentRepository,
                                   final CandidateAssessmentRepository candidateAssessmentRepository, final ReportAssessmentRepository reportAssessmentRepository,
                                   final ReportCandidateService reportCandidateService, final ModelMapper modelMapper){
        this.assessmentBlockRepository = assessmentBlockRepository;
        this.assessmentRepository = assessmentRepository;
        this.candidateAssessmentRepository = candidateAssessmentRepository;
        this.reportAssessmentRepository = reportAssessmentRepository;
        this.reportCandidateService = reportCandidateService;
        this.modelMapper = modelMapper;
    }

    public HighLevelSummaryRespDTO getHighLevelSummary(final Integer assessmentId,
                                                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        findAssessmentOrThrow(assessmentId);

        Long uniqueAssessments = this.reportAssessmentRepository.getCountAttempted(assessmentId, from, to);
        Long candidateSubmissions = this.reportAssessmentRepository.getCountCompleted(assessmentId, from, to);
        Long smartlisted = this.reportAssessmentRepository.getCountSmartListed(assessmentId, from, to);

        return new HighLevelSummaryRespDTO(uniqueAssessments, candidateSubmissions, smartlisted);
    }

    public RateSummaryRespDTO getRateSummary(final Integer assessmentId,
                                             @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                             @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        findAssessmentOrThrow(assessmentId);

        HighLevelSummaryRespDTO highLevelSummaryRespDto = getHighLevelSummary(assessmentId, from, to);

        Long candidatesMeetingBasicCriteria = this.reportAssessmentRepository.getCountMeetingBasicRequirements(assessmentId, from, to);
        Long registrationCount = this.reportAssessmentRepository.getCountRegistered(assessmentId);
        Long responseRate = (highLevelSummaryRespDto.getCandidateSubmissions() * 100) / highLevelSummaryRespDto.getUniqueAssessments();
        Long qualificationRate = (candidatesMeetingBasicCriteria * 100) / highLevelSummaryRespDto.getCandidateSubmissions();
        Long smartlistRate = (highLevelSummaryRespDto.getCandidatesSmartListed() * 100) / highLevelSummaryRespDto.getCandidateSubmissions();

        return new RateSummaryRespDTO(responseRate, qualificationRate, smartlistRate, registrationCount);
    }

    public AssessmentStatusSummaryRespDTO getAssessmentStatusSummary(final Integer assessmentId,
                                                                     @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                                                     @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        findAssessmentOrThrow(assessmentId);

        Long countOfCompletedAssessments = this.reportAssessmentRepository.getCountOfCompletedAssessments(assessmentId, from, to);
        Long countOfCandidateAssessments = this.reportAssessmentRepository.getCountAttempted(assessmentId, from, to);
        Long countOfCandidatesMeetingBasicCriteria = this.reportAssessmentRepository.getCountMeetingBasicRequirements(assessmentId, from, to);
        Long countOfSmartListedCandidates = this.reportAssessmentRepository.getCountSmartListed(assessmentId, from, to);

        Integer responseRate = countOfCandidateAssessments > 0 ? Math.round(100f * countOfCompletedAssessments / countOfCandidateAssessments) : 0;
        Integer completionRate = countOfCompletedAssessments> 0 ? Math.round(100f * countOfCandidatesMeetingBasicCriteria /countOfCompletedAssessments): 0;
        Integer smartListedRate = countOfCompletedAssessments > 0 ? Math.round(100f * countOfSmartListedCandidates / countOfCompletedAssessments): 0;

        return new AssessmentStatusSummaryRespDTO(responseRate, completionRate, smartListedRate);
    }

    public List<AssessmentBlockAverageScoreRespDTO> getAssessmentBlockAverageScore(final Integer assessmentId,
                                                                                   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                                                                   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        Assessment assessment = findAssessmentOrThrow(assessmentId);

        List<ReportData1> assessmentBlockSumOfScores = new ArrayList<>(this.reportAssessmentRepository.getAssessmentBlockSumOfScoresForAssessment(assessmentId, from, to));
        List<ReportData1> maxPossibleAssessmentBlockScores = new ArrayList<>(this.reportAssessmentRepository.getMaxPossibleAssessmentBlockScoresForAssessment(assessmentId));

        Integer completedCount = this.candidateAssessmentRepository.getCountOfCompletedAssessments(assessment);

        //Calculate Assessment block average scores as a percentage
        List<ReportData1> assessmentBlockScores = new ArrayList<>();
        maxPossibleAssessmentBlockScores.forEach(mpabs -> {
            Optional<ReportData1> abss =
                    assessmentBlockSumOfScores.stream().filter(reportData1 -> Objects.equals(reportData1.getAssessmentBlockId(), mpabs.getAssessmentBlockId())).findFirst();

            assessmentBlockScores.add(new ReportData1(mpabs.getAssessmentBlockId(),
                    mpabs.getTitle(),
                    (long)abss.map(reportData1 -> Math.round(100* ((float)reportData1.getScore() / completedCount) / mpabs.getScore())).orElse(0)));
        });

        List<AssessmentBlockAverageScoreRespDTO> arrData = new ArrayList<>();
        for (ReportData1 assessmentBlockScore : assessmentBlockScores) {
            arrData.add(this.modelMapper.map(assessmentBlockScore, AssessmentBlockAverageScoreRespDTO.class));
        }

        return arrData;
    }

    public List<AssessmentCandidatePerformanceRespDTO> getAssessmentPerformanceForAllCandidates(final Integer assessmentId,
                                                                                                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                                                                                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        findAssessmentOrThrow(assessmentId);

        List<AssessmentCandidatePerformanceRespDTO> arrData = new ArrayList<>();
        List<ReportData2> rawData = this.reportAssessmentRepository.getAssessmentPerformanceForAllCandidates(assessmentId, from, to);
        for (ReportData2 rawDatum : rawData) {
            if (rawDatum.getStatus() == CandidateAssessmentStatus.GRADING_COMPLETED) {
                CandidateAssessmentReportRespDTO reportData = this.reportCandidateService.generateCandidateReportData(rawDatum.getCandidateId(), assessmentId);
                rawDatum.setGroupAverageScore(reportData.getGroupAverageScore());
                rawDatum.setCandidateAverageScore(reportData.getCandidateAverageScore());
            } else {
                rawDatum.setGroupAverageScore(0);
                rawDatum.setCandidateAverageScore(0);
            }

            arrData.add(new AssessmentCandidatePerformanceRespDTO(rawDatum));
        }

        List<ReportData3> rawData1 = this.reportAssessmentRepository.getLastSubmissionDateForAllCandidates(assessmentId);

        for (ReportData3 reportData3 : rawData1) {
            int candidateId = reportData3.getCandidateId();
            Optional<AssessmentCandidatePerformanceRespDTO> optionalPerformanceRespDTO =  arrData.stream().filter(d -> d.getCandidateId() == candidateId).findFirst();
            optionalPerformanceRespDTO.ifPresent(performanceRespDTO -> performanceRespDTO.setLastSubmissionDate(reportData3.getLastSubmissionDate()));
        }

        return arrData;
    }

    public List<AssessmentBlockCandidatePerformanceRespDTO> getAssessmentBlockPerformanceForAllCandidates(final Integer assessmentBlockId,
                                                                                                          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                                                                                          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        findAssessmentBlockOrThrow(assessmentBlockId);

        List<AssessmentBlockCandidatePerformanceRespDTO> arrData = new ArrayList<>();
        List<ReportData2> rawData = this.reportAssessmentRepository.getAssessmentBlockPerformanceForAllCandidates(assessmentBlockId, from, to);

        for (ReportData2 rawDatum : rawData) {
            arrData.add(this.modelMapper.map(rawDatum, AssessmentBlockCandidatePerformanceRespDTO.class));
        }

        return arrData;
    }

    public TimeSeriesSummaryRespDTO getTimeSeriesSummaryForAssessment(final Integer assessmentId,
                                                                      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
                                                                      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to) {
        findAssessmentOrThrow(assessmentId);

        List<TimeSeriesDataRespDTO> arrCountOfAttempts = new ArrayList<>();
        List<TimeSeriesDataRespDTO> arrCountOfSubmissions = new ArrayList<>();

        List<ReportData8> rawData = this.reportAssessmentRepository.getTimeSeriesCountRegisteredByDate(assessmentId, from, to);

        for (ReportData8 data: rawData) {
            arrCountOfAttempts.add(new TimeSeriesDataRespDTO(data));
        }

        rawData = this.reportAssessmentRepository.getTimeSeriesCountSubmittedByDate(assessmentId, from, to);
        for (ReportData8 data: rawData) {
            arrCountOfSubmissions.add(new TimeSeriesDataRespDTO(data));
        }

        return new TimeSeriesSummaryRespDTO(arrCountOfAttempts, arrCountOfSubmissions);
    }


    private Assessment findAssessmentOrThrow(final Integer assessmentId){
        Optional<Assessment> optionalAssessment = this.assessmentRepository.findById(assessmentId);
        return optionalAssessment.orElseThrow(() -> ReportResponseCodes.INVALID_ASSESSMENT_ID);
    }

    private void findAssessmentBlockOrThrow(final Integer assessmentBlockId){
        Optional<AssessmentBlock> optionalAssessmentBlock = this.assessmentBlockRepository.findById(assessmentBlockId);
        if(optionalAssessmentBlock.isEmpty()) throw ReportResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }
}
