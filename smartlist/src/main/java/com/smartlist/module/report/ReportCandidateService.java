package com.smartlist.module.report;

import com.smartlist.model.Assessment;
import com.smartlist.model.Candidate;
import com.smartlist.model.CandidateAssessment;
import com.smartlist.model.QuestionComment;
import com.smartlist.module.assessment.AssessmentRepository;
import com.smartlist.module.candidate.CandidateAssessmentRepository;
import com.smartlist.module.candidate.CandidateRepository;
import com.smartlist.module.file.FileService;
import com.smartlist.module.grading.QuestionCommentRepository;
import com.smartlist.module.report.dto.response.CandidateAssessmentReportRespDTO;
import com.smartlist.module.report.records.ReportData1;
import com.smartlist.module.report.records.ReportData4;
import com.smartlist.module.email.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ReportCandidateService {

    private final AssessmentRepository assessmentRepository;
    private final QuestionCommentRepository questionCommentRepository;
    private final CandidateRepository candidateRepository;
    private final CandidateAssessmentRepository candidateAssessmentRepository;
    private final ReportAssessmentRepository reportAssessmentRepository;
    private final FileService fileService;
    private final EmailService emailService;
    private final TemplateEngine templateEngine;


    public ReportCandidateService(final AssessmentRepository assessmentRepository, final QuestionCommentRepository questionCommentRepository,
                                  final CandidateRepository candidateRepository, final CandidateAssessmentRepository candidateAssessmentRepository,
                                  final ReportAssessmentRepository reportAssessmentRepository, final FileService fileService,
                                  final EmailService emailService, final TemplateEngine templateEngine){
        this.assessmentRepository = assessmentRepository;
        this.questionCommentRepository = questionCommentRepository;
        this.candidateRepository = candidateRepository;
        this.candidateAssessmentRepository = candidateAssessmentRepository;
        this.reportAssessmentRepository = reportAssessmentRepository;
        this.fileService = fileService;
        this.emailService = emailService;
        this.templateEngine = templateEngine;
    }

    public CandidateAssessmentReportRespDTO getCandidateAssessmentReport(final Integer candidateId, final Integer assessmentId) {
        return generateCandidateReportData(candidateId, assessmentId);
    }

    public ResponseEntity<byte[]> getCandidateAssessmentReportAsPDF(final Integer candidateId, final Integer assessmentId) {
        Candidate candidate  = findCandidateOrThrow(candidateId);
        Assessment assessment = findAssessmentOrThrow(assessmentId);

        CandidateAssessmentReportRespDTO candidateReportRespDTO =  generateCandidateReportData(candidateId, assessmentId);
        addCandidateDemographicsToReport(candidate, candidateReportRespDTO);

        candidateReportRespDTO.setOrganizationLogo(getOrganizationPhoto(assessmentId));

        List<QuestionComment> questionComments = this.questionCommentRepository.findByCandidateAndAssessment(candidate, assessment);
        for (QuestionComment questionComment :questionComments) {
            questionComment.getQuestion().setText(questionComment.getQuestion().getText().replaceAll("<([^>]+)>", ""));
        }
        candidateReportRespDTO.setQuestionComments(questionComments);

        final Context context = new Context();
        candidateReportRespDTO.populateIntoTemplateContext(context);

        String report = this.templateEngine.process("candidate_assessment", context);
        byte[] reportBytes = this.fileService.htmlToPDF(report);

        return this.fileService.getPDFResponseEntity("candidate_report.pdf", reportBytes);
    }

    public void sendCandidateAssessmentReportMail(final Integer candidateId, final Integer assessmentId) {
        final Candidate candidate  = this.findCandidateOrThrow(candidateId);

        CandidateAssessmentReportRespDTO candidateReportRespDTO = generateCandidateReportData(candidateId, assessmentId);
        addCandidateDemographicsToReport(candidate, candidateReportRespDTO);

        candidateReportRespDTO.setOrganizationLogoFile(getOrganizationPhotoFile(assessmentId));

        this.emailService.sendReportMail(candidateReportRespDTO.getCandidateEmail(), candidateReportRespDTO);
    }

    public CandidateAssessmentReportRespDTO generateCandidateReportData(int candidateId, Integer assessmentId) {
        Candidate candidate  = findCandidateOrThrow(candidateId);
        Assessment assessment = findAssessmentOrThrow(assessmentId);
        CandidateAssessment candidateAssessment = findCandidateAssessmentOrThrow(candidate, assessment);

        final List<ReportData1> assessmentBlockSumOfScores;
        final List<ReportData1> candidateAssessmentBlockScores;
        List<ReportData1> maxPossibleAssessmentBlockScores;

        assessmentBlockSumOfScores = this.reportAssessmentRepository.getAssessmentBlockSumOfScoresForAssessment(assessmentId, LocalDate.EPOCH, LocalDate.now());

        candidateAssessmentBlockScores = this.reportAssessmentRepository.getCandidateAssessmentBlockScoresForAssessment(candidateId, assessmentId);

        int overallScore = 0;
        for (ReportData1 candidateAssessmentBlockScore : candidateAssessmentBlockScores) {
            overallScore += candidateAssessmentBlockScore.getScore();
        }


        maxPossibleAssessmentBlockScores = this.reportAssessmentRepository.getMaxPossibleAssessmentBlockScoresForAssessment(assessmentId);

        int overallMaxScore = 0;
        for (ReportData1 assessmentBlockSumOfScore : assessmentBlockSumOfScores) {
            overallMaxScore += assessmentBlockSumOfScore.getScore();
        }

        Integer completedCount = this.candidateAssessmentRepository.getCountOfCompletedAssessments(assessment);

        //Calculate Assessment block average scores as a percentage
        List<ReportData4> assessmentBlockScores = new ArrayList<>();

        maxPossibleAssessmentBlockScores.forEach(mpabs -> {
            Optional<ReportData1> abss = assessmentBlockSumOfScores.stream().filter(obj -> Objects.equals(obj.getAssessmentBlockId(), mpabs.getAssessmentBlockId())).findFirst();

            Optional<ReportData1> cabs = candidateAssessmentBlockScores.stream().filter(obj -> Objects.equals(obj.getAssessmentBlockId(), mpabs.getAssessmentBlockId())).findFirst();
            assessmentBlockScores.add(new ReportData4(mpabs.getTitle(),
                    abss.map(reportData1 -> Math.round((((float) reportData1.getScore() / completedCount) * 100) / mpabs.getScore())).orElse(0),
                    cabs.map(data1 -> Math.round((float)(data1.getScore() * 100) / mpabs.getScore())).orElse(0)));

        });

        //Calculate Assessment average scores as a percentage
        AtomicInteger groupAverageTotalScore = new AtomicInteger(0);
        assessmentBlockScores.forEach(obj -> groupAverageTotalScore.set(obj.getGroupAvgScore()));

        int groupAverageScore = Math.round((float)groupAverageTotalScore.get() / assessmentBlockScores.size());

        AtomicInteger candidateAverageTotalScore = new AtomicInteger(0);
        assessmentBlockScores.forEach(obj -> candidateAverageTotalScore.set(obj.getCandidateScore()));

        int candidateAverageScore = Math.round((float)candidateAverageTotalScore.get() / assessmentBlockScores.size());

        int candidateOverallScore = Math.round((100 * (float)overallScore) / overallMaxScore);

        //compose report data
        CandidateAssessmentReportRespDTO candidateAssessmentReportRespDto = new CandidateAssessmentReportRespDTO();
        candidateAssessmentReportRespDto.setStartDate(candidateAssessment.getStartDate());
        candidateAssessmentReportRespDto.setEndDate(candidateAssessment.getEndDate());
        candidateAssessmentReportRespDto.setAssessmentDecision(candidateAssessment.getAssessmentDecision());
        candidateAssessmentReportRespDto.setGroupAverageScore(groupAverageScore);
        candidateAssessmentReportRespDto.setCandidateAverageScore(candidateAverageScore);
        candidateAssessmentReportRespDto.setAssessmentBlockScores(assessmentBlockScores);
        candidateAssessmentReportRespDto.setOverallScore(candidateOverallScore);
        candidateAssessmentReportRespDto.setAssessmentName(assessment.getName());

        return candidateAssessmentReportRespDto;
    }

    private void addCandidateDemographicsToReport(final Candidate candidate,  final CandidateAssessmentReportRespDTO candidateAssessmentReportRespDTO){
        //get the photo of candidate and convert it to base64
        String photoData = "";
        if (candidate.getPhoto() != null) {
            byte[] data = this.fileService.readFile(candidate.getPhoto());
            photoData = this.fileService.getBase64EncodedFileData(data);
        }
        candidateAssessmentReportRespDTO.setCandidateName(candidate.getName());
        candidateAssessmentReportRespDTO.setCandidateEmail(candidate.getEmail());
        candidateAssessmentReportRespDTO.setCandidateContactNumber(candidate.getContactNumber());

        candidateAssessmentReportRespDTO.setCandidatePhoto(photoData);
        candidateAssessmentReportRespDTO.setCandidatePhotoFile(new File(FileService.ROOT_ASSET_FOLDER.resolve(candidate.getPhoto().getUrl()).toString()));
    }

    private String getOrganizationPhoto(final Integer assessmentId) {
        Assessment assessment = this.assessmentRepository.findByIdWithRelations(assessmentId).orElse(null);

        if (assessment != null && assessment.getOrganization().getLogo() != null) {
            return this.fileService.getBase64EncodedFileData(this.fileService.readFile(assessment.getOrganization().getLogo()));
        }
        return "";
    }

    private File getOrganizationPhotoFile(final Integer assessmentId) {
        Assessment assessment = this.assessmentRepository.findByIdWithRelations(assessmentId).orElse(null);

        if (assessment != null && assessment.getOrganization().getLogo() != null) {
            return new File(FileService.ROOT_ASSET_FOLDER.resolve(assessment.getOrganization().getLogo().getUrl()).toString());
        }
        return new File("");
    }

    private Candidate findCandidateOrThrow(final Integer candidateId){
        Optional<Candidate> optionalCandidate = this.candidateRepository.findById(candidateId);
        return optionalCandidate.orElseThrow(() -> ReportResponseCodes.INVALID_CANDIDATE_ID);
    }

    private Assessment findAssessmentOrThrow(final Integer assessmentId){
        Optional<Assessment> optionalAssessment = this.assessmentRepository.findById(assessmentId);
        return optionalAssessment.orElseThrow(() -> ReportResponseCodes.INVALID_ASSESSMENT_ID);
    }

    private CandidateAssessment findCandidateAssessmentOrThrow(final Candidate candidate, final Assessment assessment){
        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findByCandidateAndAssessment(candidate, assessment);
        return optionalCandidateAssessment.orElseThrow(() -> ReportResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS);
    }

}
