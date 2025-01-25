package com.smartlist.module.assessment;

import com.smartlist.enums.AssessmentStatus;
import com.smartlist.model.*;
import com.smartlist.module.assessment.dto.request.AssessmentReqDTO;
import com.smartlist.module.assessment.dto.request.DuplicateAssessmentForOrganizationsReqDTO;
import com.smartlist.module.assessment.dto.response.AssessmentRespDTO;
import com.smartlist.module.assessment.dto.response.AssessmentStatusCountRespDTO;
import com.smartlist.module.file.FileService;
import com.smartlist.module.file.FileRepository;
import com.smartlist.module.organization.OrganizationRepository;
import com.smartlist.module.question.QuestionRepository;
import com.smartlist.services.CryptoService;
import com.smartlist.services.GeneralRepository;
import com.smartlist.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class AssessmentService {

    //Autowired
    private final GeneralRepository<Assessment> generalRepository;
    private final AssessmentRepository assessmentRepository;
    private final OrganizationRepository organizationRepository;
    private final QuestionRepository questionRepository;
    private final FileRepository fileRepository;
    private final CryptoService cryptoService;
    private final FileService fileService;
    private final ModelMapper modelMapper;

    //Global


    @Autowired
    public AssessmentService(final AssessmentRepository assessmentRepository, final OrganizationRepository organizationRepository,
                             final QuestionRepository questionRepository, final FileRepository fileRepository,
                             final GeneralRepository<Assessment> generalRepository, final CryptoService cryptoService,
                             final FileService fileService, final ModelMapper modelMapper){

        this.generalRepository = generalRepository;
        this.assessmentRepository = assessmentRepository;
        this.organizationRepository = organizationRepository;
        this.questionRepository = questionRepository;
        this.fileRepository = fileRepository;
        this.cryptoService = cryptoService;
        this.fileService = fileService;
        this.modelMapper = modelMapper;

        AssessmentReqDTO.addDTOToEntityMappings(this.modelMapper);
    }

    public List<AssessmentRespDTO> getAllForOrganization(final Integer organizationId, final AssessmentStatus status) {
        log.info("getAllForOrganization {},{}", organizationId, status);

        Organization organization = getOrganizationOrThrow(organizationId);
        throwIfAssessmentStatusInvalid(status);

        List<Assessment> assessments = this.assessmentRepository.findByOrganizationAndStatus(organization, status);
        List<AssessmentRespDTO> assessmentsResponse = new ArrayList<>();
        assessments.forEach(assessment -> assessmentsResponse.add(this.modelMapper.map(assessment, AssessmentRespDTO.class)));

        return assessmentsResponse;
    }


    public AssessmentRespDTO getAssessmentById(final Integer id) {
        Assessment assessment = getAssessmentOrThrow(id);

        return this.modelMapper.map(assessment, AssessmentRespDTO.class);
    }

    public AssessmentRespDTO getAssessmentByToken(final String token) {
        Optional<Assessment> optionalAssessment = this.assessmentRepository.findByToken(token);
        Assessment assessment = optionalAssessment.orElseThrow (this::throwIfAssessmentTokenNotFound);

        return this.modelMapper.map(assessment, AssessmentRespDTO.class);
    }

    public void publishAssessment(final Integer id) {
        Optional<Assessment> optionalAssessment = this.assessmentRepository.findByIdWithRelations(id);
        Assessment assessment = optionalAssessment.orElseThrow (this::throwIfAssessmentNotFound);

        throwIfPublished(assessment);
        throwIfAssessmentBlockCountInvalid(assessment);
        throwIfQuestionCountInvalid(assessment);

        assessment.setActivatedOn(DateUtils.getFormattedDate());
        assessment.setStatus(AssessmentStatus.ACTIVE);

        this.assessmentRepository.save(assessment);
    }

    public Integer createAssessment(final AssessmentReqDTO assessmentReqDTO) {
        Organization organization =  getOrganizationOrThrow(assessmentReqDTO.getOrganizationId());

        if (assessmentReqDTO.getHeaderImageId() != null) {
            throwIfHeaderFileInvalid(assessmentReqDTO.getHeaderImageId());
        }

        final Optional<Assessment> optionalAssessment = this.assessmentRepository.findByNameAndOrganization(assessmentReqDTO.getName(), organization);

        if (optionalAssessment.isPresent()) {
            throw AssessmentResponseCodes.ASSESSMENT_NAME_EXISTS;
        }

        String token = this.cryptoService.generateToken();

        Assessment assessment = this.modelMapper.map(assessmentReqDTO, Assessment.class);
        assessment.setToken(token);
        assessment = this.assessmentRepository.save(assessment);

        return assessment.getId();

    }

    public void updateAssessment(final Integer assessmentId, final AssessmentReqDTO assessmentReqDTO) {
        Assessment assessment = getAssessmentOrThrow(assessmentId);
        throwIfPublished(assessment);

        Organization organization = getOrganizationOrThrow(assessmentReqDTO.getOrganizationId());

        if (assessmentReqDTO.getHeaderImageId() != null) {
            throwIfHeaderFileInvalid(assessmentReqDTO.getHeaderImageId());
        }

        Optional<Assessment> optionalAssessment =  this.assessmentRepository.findByNameAndOrganization(assessmentReqDTO.getName(), organization);
        if (optionalAssessment.isPresent() && !optionalAssessment.get().getId().equals(assessmentId) ) {
            throw AssessmentResponseCodes.ASSESSMENT_NAME_EXISTS;
        }

        Assessment updatedAssessment = this.modelMapper.map(assessmentReqDTO, Assessment.class);
        updatedAssessment.setId(assessmentId);
        updatedAssessment.setToken(assessment.getToken());

        this.assessmentRepository.save(updatedAssessment);
    }

    public void deleteAssessment(final Integer assessmentId) {
        Assessment assessment = getAssessmentOrThrow(assessmentId);

        throwIfPublished(assessment);
        this.assessmentRepository.delete(assessment);
    }

    public void setAssessmentActive(final Integer assessmentId, final boolean active) {
        Assessment assessment = getAssessmentOrThrow(assessmentId);

        throwIfDraft(assessment);
        if (active) {
            assessment.setStatus(AssessmentStatus.ACTIVE);
            assessment.setActivatedOn(DateUtils.getFormattedDate());
        }else {
            assessment.setStatus(AssessmentStatus.ARCHIVED);
            assessment.setDeactivatedOn(DateUtils.getFormattedDate());
        }
        this.assessmentRepository.save(assessment);

    }

    public Integer duplicateAssessment(final Organization organization, final Integer assessmentId) {
        Optional<Assessment> optionalAssessment = this.assessmentRepository.findByIdWithRelations(assessmentId);
        Assessment assessment = optionalAssessment.orElseThrow (this::throwIfAssessmentNotFound);

        buildDeepCopyOfAssessment(assessment);

        this.generalRepository.detachEntity(assessment);

        String token = this.cryptoService.generateToken();
        if (organization != null) {
            assessment.setOrganization(organization);
        }
        assessment.setToken(token);
        assessment.setStatus(AssessmentStatus.DRAFT);
        assessment.setActivatedOn(null);
        if (assessment.getHeaderImage() != null) {
            AssetFile headerImageFile = this.fileService.copyAndSaveFile(assessment.getHeaderImage());
            assessment.setHeaderImage(headerImageFile);
        }
        this.assessmentRepository.save(assessment);

        return assessment.getId();
    }


    public List<AssessmentRespDTO> searchByStatusAndNameForOrganization(final Integer organizationId, final String assessmentName, final AssessmentStatus status) {
        Organization organization = getOrganizationOrThrow(organizationId);

        this.throwIfAssessmentStatusInvalid(status);

        List<Assessment> assessments = this.assessmentRepository.findByStatusAndOrganizationAndNameContaining(status, organization, assessmentName);
        List<AssessmentRespDTO> assessmentsResponses = new ArrayList<>();
        assessments.forEach(assessment -> assessmentsResponses.add(this.modelMapper.map(assessment, AssessmentRespDTO.class)));
        return assessmentsResponses;

    }

    public AssessmentStatusCountRespDTO getAssessmentStatusCount(final Integer organizationId) {
        Organization organization = getOrganizationOrThrow(organizationId);

        List<Assessment> assessments = this.assessmentRepository.findByOrganization(organization);
        int activeCount = 0;
        int archivedCount = 0;
        int draftsCount = 0;
        for(Assessment assessment: assessments){
            switch (assessment.getStatus()) {
                case ACTIVE -> activeCount++;
                case ARCHIVED -> archivedCount++;
                case DRAFT -> draftsCount++;
            }
        }
        return new AssessmentStatusCountRespDTO(activeCount, archivedCount, draftsCount);
    }

    public void duplicateAssessmentForOrganizations(final DuplicateAssessmentForOrganizationsReqDTO duplicateAssessmentForOrganizationsReqDto) {
        Assessment assessment = getAssessmentOrThrow(duplicateAssessmentForOrganizationsReqDto.getAssessmentId());

        List<Organization> organizations = new ArrayList<>();

        for (int i = 0; i < duplicateAssessmentForOrganizationsReqDto.getOrganizationIds().size(); i++) {
            Integer id =  duplicateAssessmentForOrganizationsReqDto.getOrganizationIds().get(i);
            Organization organization = getOrganizationOrThrow(id);
            organizations.add(organization);
        }
        organizations.forEach(organization -> this.duplicateAssessment(organization, assessment.getId()));
    }


    private void buildDeepCopyOfAssessment(final Assessment assessment) {
        assessment.setId(null);
        assessment.setName(assessment.getName() + " copy");
        for(AssessmentBlock assessmentBlock: assessment.getAssessmentBlocks()){
            assessmentBlock.setId(null);
            for(Question question :assessmentBlock.getQuestions()){
                question.setId(null);
                for(AnswerOption answerOption: question.getAnswerOptions()){
                    answerOption.setId(null);
                }
            }
        }
    }


    private Organization getOrganizationOrThrow(final Integer organizationId) {
        final Optional<Organization> optionalOrganization = this.organizationRepository.findById(organizationId);
        return optionalOrganization.orElseThrow(() -> AssessmentResponseCodes.INVALID_ORGANIZATION_ID);
    }

    private Assessment getAssessmentOrThrow(final Integer id) {
        Optional<Assessment> optionalAssessment = this.assessmentRepository.findById(id);
        return optionalAssessment.orElseThrow (() -> AssessmentResponseCodes.INVALID_ASSESSMENT_ID);
    }

    private void throwIfHeaderFileInvalid(final Integer id) {
        Optional<AssetFile> optionalHeaderFile = this.fileRepository.findById(id);
        if(optionalHeaderFile.isEmpty()){
            throw AssessmentResponseCodes.INVALID_HEADER_FILE_ID;
        }
    }

    private void throwIfAssessmentStatusInvalid(AssessmentStatus status) {
        switch (status) {
            case DRAFT, ACTIVE, ARCHIVED:
                break;
            default:
                throw AssessmentResponseCodes.INVALID_ASSESSMENT_STATUS;
        }
    }

    private void throwIfAssessmentBlockCountInvalid(Assessment assessment) {
        if (assessment.getAssessmentBlocks().isEmpty()) {
            throw AssessmentResponseCodes.INVALID_ASSESSMENT_BLOCK_COUNT;
        }
    }

    private void  throwIfQuestionCountInvalid(Assessment assessment) {
        for (int i = 0; i < assessment.getAssessmentBlocks().size(); i++) {
        List<Question> questions = this.questionRepository.findByAssessmentBlock(assessment.getAssessmentBlocks().get(i));
            if (questions.isEmpty()) {
                throw AssessmentResponseCodes.INVALID_QUESTION_COUNT;
            }
        }
    }

    private void throwIfDraft(Assessment assessment) {
        if (assessment.getStatus() == AssessmentStatus.DRAFT) {
            throw AssessmentResponseCodes.ASSESSMENT_ACTION_DENIED;
        }
    }

    private void throwIfPublished(Assessment assessment) {
        if (assessment.getStatus() != AssessmentStatus.DRAFT) {
            throw AssessmentResponseCodes.ASSESSMENT_ACTION_DENIED;
        }
    }

    private ResponseStatusException throwIfAssessmentNotFound() {
        return AssessmentResponseCodes.INVALID_ASSESSMENT_ID;
    }

    private ResponseStatusException throwIfAssessmentTokenNotFound() {
        return AssessmentResponseCodes.INVALID_ASSESSMENT_TOKEN;
    }
}
