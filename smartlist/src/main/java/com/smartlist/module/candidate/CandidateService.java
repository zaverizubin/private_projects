package com.smartlist.module.candidate;

import com.smartlist.enums.TimeoutConfig;
import com.smartlist.enums.AssessmentStatus;
import com.smartlist.enums.CandidateAssessmentStatus;
import com.smartlist.module.assessment.AssessmentRepository;
import com.smartlist.module.assessmentblock.AssessmentBlockRepository;
import com.smartlist.module.auth.AuthService;
import com.smartlist.module.auth.dto.response.AuthRespDTO;
import com.smartlist.module.candidate.dto.request.CreateCandidateReqDTO;
import com.smartlist.module.candidate.dto.request.SubmitAnswerReqDTO;
import com.smartlist.module.candidate.dto.request.UpdateCandidateProfileReqDTO;
import com.smartlist.module.candidate.dto.response.CandidateAssessmentIntroRespDTO;
import com.smartlist.module.candidate.dto.response.CandidateAssessmentRespDTO;
import com.smartlist.module.candidate.dto.response.CandidateRespDTO;
import com.smartlist.module.candidate.dto.response.CandidateResponseRespDTO;
import com.smartlist.module.candidate.interfaces.IQuestionStrategy;
import com.smartlist.module.candidate.questionstrategy.QuestionStrategyFactory;
import com.smartlist.module.file.FileRepository;
import com.smartlist.module.grading.GradingService;
import com.smartlist.module.organization.OrganizationRepository;
import com.smartlist.module.question.QuestionRepository;
import com.smartlist.module.user.UserResponseCodes;
import com.smartlist.module.sms.SMSService;
import com.smartlist.utils.AppUtils;
import com.smartlist.utils.QuestionTypeUtils;
import com.smartlist.model.*;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final OrganizationRepository organizationRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentBlockRepository assessmentBlockRepository;
    private final CandidateAssessmentRepository candidateAssessmentRepository;
    private final CandidateResponseRepository candidateResponseRepository;
    private final FileRepository fileRepository;
    private final QuestionRepository questionRepository;
    private final CandidateAttemptLogRepository candidateAttemptLogRepository;
    private final GradingService gradingService;
    private final SMSService smsService;
    private final AuthService authService;
    private final QuestionStrategyFactory questionStrategyFactory;
    private final ModelMapper modelMapper;

    public CandidateService(final CandidateRepository candidateRepository, final OrganizationRepository organizationRepository,
                            final AssessmentRepository assessmentRepository, final AssessmentBlockRepository assessmentBlockRepository,
                            final CandidateAssessmentRepository candidateAssessmentRepository, final CandidateResponseRepository candidateResponseRepository,
                            final FileRepository fileRepository, final QuestionRepository questionRepository,
                            final CandidateAttemptLogRepository candidateAttemptLogRepository, final GradingService gradingService,
                            final SMSService smsService, final AuthService authService, final QuestionStrategyFactory questionStrategyFactory,
                            final ModelMapper modelMapper){

        this.candidateRepository = candidateRepository;
        this.organizationRepository = organizationRepository;
        this.assessmentRepository = assessmentRepository;
        this.assessmentBlockRepository = assessmentBlockRepository;
        this.candidateAssessmentRepository = candidateAssessmentRepository;
        this.candidateResponseRepository = candidateResponseRepository;
        this.fileRepository = fileRepository;
        this.questionRepository = questionRepository;
        this.candidateAttemptLogRepository = candidateAttemptLogRepository;
        this.gradingService = gradingService;
        this.smsService = smsService;
        this.authService = authService;
        this.questionStrategyFactory = questionStrategyFactory;
        this.modelMapper = modelMapper;

        CreateCandidateReqDTO.addDTOToEntityMappings(this.modelMapper);
        UpdateCandidateProfileReqDTO.addDTOToEntityMappings(this.modelMapper);
        CandidateResponseRespDTO.addEntityToDTOMappings(this.modelMapper);
    }

    public CandidateAssessmentIntroRespDTO getCandidateAssessmentIntro(final String token) {
        Optional<Assessment> optionalAssessment =  this.assessmentRepository.findByToken(token);
        Assessment assessment = optionalAssessment.orElseThrow (() -> CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN);

        if (assessment.getStatus() == AssessmentStatus.ARCHIVED) {
            throw CandidateResponseCodes.ASSESSMENT_ACTION_DENIED;
        }

        int blockCount = this.assessmentBlockRepository.countByAssessment(assessment);
        int questionCount = this.questionRepository.countByAssessment(assessment);

        Organization organization = this.organizationRepository.getById(assessment.getOrganization().getId());

        return new CandidateAssessmentIntroRespDTO(organization, assessment, blockCount, questionCount);
    }


    public Integer createCandidate(final CreateCandidateReqDTO createCandidateReqDTO) {
        Optional<Candidate> optionalCandidate =  this.candidateRepository.findByContactNumber(createCandidateReqDTO.getContactNumber());
        if (optionalCandidate.isPresent()) {
            throw CandidateResponseCodes.CANDIDATE_EXISTS;
        }
        AssetFile photo = null;
        if (createCandidateReqDTO.getPhotoId()!= null && createCandidateReqDTO.getPhotoId()> 0) {
            Optional<AssetFile> optionalPhoto = this.fileRepository.findById(createCandidateReqDTO.getPhotoId());
            photo = optionalPhoto.orElseThrow(() -> UserResponseCodes.INVALID_PROFILE_PHOTO_FILE_ID);
        }

        Candidate candidate = this.modelMapper.map(createCandidateReqDTO, Candidate.class);
        candidate.setPhoto(photo);
        candidate.setVerificationCode(AppUtils.generateOTP());
        candidate = this.candidateRepository.save(candidate);

        String message = this.smsService.sendOTP(candidate.getContactNumber(), candidate.getVerificationCode());
        log.info("SMS status for candidate with phone#: {}, {}", candidate.getContactNumber(), message);

        return candidate.getId();
    }

    public AuthRespDTO verifyCandidateOTPandLogin(final Integer candidateId, final Integer verificationCode) {
        Optional<Candidate> optionalCandidate = this.candidateRepository.findById(candidateId);
        Candidate candidate = optionalCandidate.orElseThrow (() -> CandidateResponseCodes.INVALID_CANDIDATE_ID);

        if (!Objects.equals(candidate.getVerificationCode(), verificationCode)) {
            throw CandidateResponseCodes.INVALID_VERIFICATION_CODE;
        }
        if (candidate.isVerified()) {
            throw CandidateResponseCodes.CANDIDATE_ALREADY_VERIFIED;
        }
        candidate.setVerified(true);
        this.candidateRepository.save(candidate);

        return this.authService.loginCandidate(candidate);
    }

    public void sendCandidateOTP(final Integer candidateId) {
        Optional<Candidate> optionalCandidate =  this.candidateRepository.findById(candidateId);
        Candidate candidate = optionalCandidate.orElseThrow (() -> CandidateResponseCodes.INVALID_CANDIDATE_ID);

        candidate.setVerificationCode(AppUtils.generateOTP());
        candidate.setVerified(false);

        this.candidateRepository.save(candidate);
        // TODO: Add code to send verification code to user here
        this.smsService.sendOTP(candidate.getContactNumber(), candidate.getVerificationCode());
    }

    public void updateCandidateProfile(final Integer candidateId, final UpdateCandidateProfileReqDTO updateCandidateProfileReqDTO) {
        AssetFile photo = null;
        if (updateCandidateProfileReqDTO.getPhotoId() != null) {
            Optional<AssetFile> optionalPhotoFile = this.fileRepository.findById(updateCandidateProfileReqDTO.getPhotoId());
            photo = optionalPhotoFile.orElseThrow(() -> CandidateResponseCodes.INVALID_PHOTO_FILE_ID);
        }

        Optional<Candidate> optionalCandidate = this.candidateRepository.findByEmail(updateCandidateProfileReqDTO.getEmail());
        if (optionalCandidate.isPresent() && !Objects.equals(optionalCandidate.get().getId(), candidateId)) {
            throw CandidateResponseCodes.CANDIDATE_EMAIL_EXISTS;
        }

        optionalCandidate = this.candidateRepository.findById(candidateId);
        Candidate candidate = optionalCandidate.orElseThrow(() -> CandidateResponseCodes.INVALID_CANDIDATE_ID);
        candidate.setPhoto(photo);

        this.modelMapper.map(updateCandidateProfileReqDTO, candidate);
        this.candidateRepository.save(candidate);
    }

    public CandidateRespDTO getCandidateByContactNumber(final String contactNumber) {
        Optional<Candidate> optionalCandidate = this.candidateRepository.findByContactNumber(contactNumber);
        Candidate candidate = optionalCandidate.orElseThrow (() -> CandidateResponseCodes.INVALID_CANDIDATE_CONTACT_NUMBER);

        return this.modelMapper.map(candidate, CandidateRespDTO.class);
    }

    public CandidateRespDTO getCandidateById(final Integer id) {
        Optional<Candidate> optionalCandidate = this.candidateRepository.findById(id);
        Candidate candidate = optionalCandidate.orElseThrow (() -> CandidateResponseCodes.INVALID_CANDIDATE_ID);

        return this.modelMapper.map(candidate, CandidateRespDTO.class);
    }

    public Integer createCandidateAssessment(final Integer candidateId, final String token) {
        Optional<Candidate> optionalCandidate  = this.candidateRepository.findById(candidateId);
        Candidate candidate = optionalCandidate.orElseThrow(()->CandidateResponseCodes.INVALID_CANDIDATE_ID);

        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findByCandidate(candidate);
        if (optionalCandidateAssessment.isPresent() && optionalCandidateAssessment.get().getAssessment().getToken().equals(token)) {
            throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_EXISTS;
        }

        Optional<Assessment> optionalAssessment = this.assessmentRepository.findByTokenWithAssessmentBlocks(token);
        Assessment assessment  = optionalAssessment.orElseThrow(() -> CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN);
        if (assessment.getStatus() != AssessmentStatus.ACTIVE) {
            throw CandidateResponseCodes.ASSESSMENT_ACTION_DENIED;
        }

        CandidateAssessment candidateAssessment = new CandidateAssessment(candidate, assessment);

        this.candidateAssessmentRepository.save(candidateAssessment);
        return candidateAssessment.getId();
    }

    public List<CandidateRespDTO> getCandidateByNameForOrganization(final Integer organizationId, final String name) {
        Optional<Organization> optionalOrganization = this.organizationRepository.findById(organizationId);
        Organization organization = optionalOrganization.orElseThrow (() ->CandidateResponseCodes.INVALID_ORGANIZATION_ID);

        List<Candidate> candidates= this.candidateRepository.findByNameForOrganization(name, organization);

        List<CandidateRespDTO> candidatesResponse = new ArrayList<>();
        candidates.forEach(candidate -> candidatesResponse.add(this.modelMapper.map(candidate, CandidateRespDTO.class)));

        return candidatesResponse;
    }

    public CandidateAssessmentRespDTO getCandidateAssessmentByToken(final Integer candidateId, final String token) {
        Optional<Candidate> optionalCandidate =  this.candidateRepository.findById(candidateId);
        Candidate candidate = optionalCandidate.orElseThrow(() -> CandidateResponseCodes.INVALID_CANDIDATE_ID);

        Optional<Assessment> optionalAssessment = this.assessmentRepository.findByToken(token);
        Assessment assessment = optionalAssessment.orElseThrow(() -> CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN);

        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findByCandidateAndAssessmentToken(candidate, assessment.getToken());
        CandidateAssessment candidateAssessment = optionalCandidateAssessment.orElseThrow(() -> CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS);

        if (TimeoutConfig.isExpired(candidateAssessment.getStartDate(), TimeoutConfig.ASSESSMENT_DURATION)) {
           throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_TIMED_OUT;
        }

        return this.modelMapper.map(candidateAssessment, CandidateAssessmentRespDTO.class);

    }

    public CandidateAssessmentRespDTO getCandidateAssessmentByAssessmentId(final Integer candidateId, final Integer assessmentId) {
        Optional<Candidate> optionalCandidate = this.candidateRepository.findById(candidateId);
        Candidate candidate = optionalCandidate.orElseThrow(() -> CandidateResponseCodes.INVALID_CANDIDATE_ID);

        Optional<Assessment> optionalAssessment =  this.assessmentRepository.findById(assessmentId);
        Assessment assessment = optionalAssessment.orElseThrow(() -> CandidateResponseCodes.INVALID_ASSESSMENT_ID);

        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findByCandidateAndAssessment(candidate, assessment);
        CandidateAssessment candidateAssessment = optionalCandidateAssessment.orElseThrow(() -> CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID);

        return this.modelMapper.map(candidateAssessment, CandidateAssessmentRespDTO.class);
    }

    public void logAssessmentAttempt(final Integer candidateId, final Integer assessmentId) {
        Optional<Candidate> optionalCandidate = this.candidateRepository.findById(candidateId);
        Candidate candidate = optionalCandidate.orElseThrow(() -> CandidateResponseCodes.INVALID_CANDIDATE_ID);

        Optional<Assessment> optionalAssessment = this.assessmentRepository.findById(assessmentId);
        Assessment assessment = optionalAssessment.orElseThrow(() -> CandidateResponseCodes.INVALID_ASSESSMENT_ID);

        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findByCandidateAndAssessment(candidate, assessment);
        if (optionalCandidateAssessment.isEmpty()) {
            throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_NOT_FOUND;
        }

        CandidateAttemptLog candidateAttemptLog  = new CandidateAttemptLog();
        candidateAttemptLog.setCandidate(candidate);
        candidateAttemptLog.setAssessment(assessment);
        candidateAttemptLog.setAttemptedOn(LocalDateTime.now());
        this.candidateAttemptLogRepository.save(candidateAttemptLog);
    }

    @Transactional
    public void submitAnswer(final Integer candidateAssessmentId, final Integer questionId, final SubmitAnswerReqDTO submitAnswerReqDTO) {
        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findById(candidateAssessmentId);
        CandidateAssessment candidateAssessment = optionalCandidateAssessment.orElseThrow(() -> CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID);

        if (candidateAssessment.getStatus() != CandidateAssessmentStatus.IN_PROGRESS) {
            throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
        }

        Optional<Question> optionalQuestion = this.questionRepository.findById(questionId);
        Question question = optionalQuestion.orElseThrow(() -> CandidateResponseCodes.INVALID_QUESTION_ID);

        if (!Objects.equals(question.getAssessmentBlock().getId(), candidateAssessment.getAssessmentBlock().getId())) {
            throw CandidateResponseCodes.ASSESSMENT_BLOCK_QUESTION_MISMATCH;
        }

        IQuestionStrategy questionStrategy = this.questionStrategyFactory.getQuestionStrategy(submitAnswerReqDTO, question);
        questionStrategy.validate();

        this.candidateResponseRepository.removeByQuestionAndCandidateAssessment(question, candidateAssessment);

        CandidateResponse candidateResponse = new CandidateResponse();
        candidateResponse.setQuestion(question);
        candidateResponse.setCandidateAssessment(candidateAssessment);
        if (QuestionTypeUtils.isAutoScored(question.getType())) {
            candidateResponse.setAnswers(submitAnswerReqDTO.getAnswerIds().stream().map(String::valueOf).collect(Collectors.joining(",")));
        } else {
            if (QuestionTypeUtils.isFileCompatibleType(question.getType())) {
                Optional<AssetFile> optionalFile  = this.fileRepository.findById(submitAnswerReqDTO.getFileId());
                AssetFile file = optionalFile.orElseThrow(() -> CandidateResponseCodes.INVALID_FILE_ID);
                candidateResponse.setFile(file);
                candidateResponse.setAnswerText(submitAnswerReqDTO.getAnswerText());
            } else {
                candidateResponse.setAnswerText(submitAnswerReqDTO.getAnswerText());
            }
        }

        this.candidateResponseRepository.save(candidateResponse);

        if (QuestionTypeUtils.isAutoScored(question.getType())) {
            this.gradingService.autoScoreAndSaveCandidateResponseScore(candidateAssessment.getCandidate(), question, questionStrategy);
        }
    }

    public void setActiveAssessmentBlock(final Integer candidateAssessmentId, final Integer assessmentBlockId) {
        Optional<CandidateAssessment> optionalCandidateAssessment  = this.candidateAssessmentRepository.findById(candidateAssessmentId);
        CandidateAssessment candidateAssessment = optionalCandidateAssessment.orElseThrow(() -> CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID);

        if (candidateAssessment.getStatus() != CandidateAssessmentStatus.IN_PROGRESS) {
            throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
        }

        Optional<AssessmentBlock> optionalAssessmentBlock = this.assessmentBlockRepository.findById(assessmentBlockId);
        if (optionalAssessmentBlock.isEmpty() || !Objects.equals(optionalAssessmentBlock.get().getAssessment().getId(), candidateAssessment.getAssessment().getId())) {
            throw CandidateResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
        }

        candidateAssessment.setAssessmentBlock(optionalAssessmentBlock.get());
        this.candidateAssessmentRepository.save(candidateAssessment);
    }

    public void markCandidateAssessmentComplete(final Integer candidateAssessmentId) {
        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findById(candidateAssessmentId);
        CandidateAssessment candidateAssessment = optionalCandidateAssessment.orElseThrow(() -> CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID);


        if (candidateAssessment.getStatus() != CandidateAssessmentStatus.IN_PROGRESS) {
            throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
        }

        candidateAssessment.setStatus(CandidateAssessmentStatus.GRADING_PENDING);
        candidateAssessment.setEndDate(LocalDateTime.now());

        this.candidateAssessmentRepository.save(candidateAssessment);
    }

    public List<CandidateResponseRespDTO> getResponsesByQuestionId(final Integer candidateAssessmentId, final Integer questionId) {
        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findById(candidateAssessmentId);
        CandidateAssessment candidateAssessment = optionalCandidateAssessment.orElseThrow(() ->  CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID);

        Optional<Question> optionalQuestion = this.questionRepository.findById(questionId);
        Question question = optionalQuestion.orElseThrow(() -> CandidateResponseCodes.INVALID_QUESTION_ID);

        List<CandidateResponse> candidateResponses = this.candidateResponseRepository.findByCandidateAssessmentAndQuestion(
                candidateAssessment,
                question);

        List<CandidateResponseRespDTO> candidateResponseRespDTOs = new ArrayList<>();
        candidateResponses.forEach(candidateResponse -> candidateResponseRespDTOs.add(this.modelMapper.map(candidateResponse, CandidateResponseRespDTO.class)));

        return candidateResponseRespDTOs;
    }


}
