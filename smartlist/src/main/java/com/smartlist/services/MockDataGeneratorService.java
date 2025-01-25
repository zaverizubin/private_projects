package com.smartlist.services;

import com.smartlist.config.PropertiesConfig;
import com.smartlist.model.*;
import com.smartlist.model.mocks.*;
import com.smartlist.module.assessment.AssessmentRepository;
import com.smartlist.module.assessmentblock.AssessmentBlockRepository;
import com.smartlist.module.candidate.CandidateRepository;
import com.smartlist.module.email.EmailRepository;
import com.smartlist.module.file.FileRepository;
import com.smartlist.module.grading.QuestionCommentRepository;
import com.smartlist.module.organization.OrganizationRepository;
import com.smartlist.module.question.AnswerOptionRepository;
import com.smartlist.module.question.QuestionRepository;
import com.smartlist.module.sms.SMSRepository;
import com.smartlist.module.user.UserEmailInviteRepository;
import com.smartlist.module.user.UserEmailVerificationRepository;
import com.smartlist.module.user.UserForgotPasswordRepository;
import com.smartlist.module.user.UserRepository;
import org.instancio.Instancio;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class MockDataGeneratorService {

    //Autowired
    private final PropertiesConfig propertiesConfig;
    private final FileRepository fileRepository;
    private final SMSRepository smsRepository;
    private final EmailRepository emailRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final UserEmailInviteRepository userEmailInviteRepository;
    private final UserEmailVerificationRepository userEmailVerificationRepository;
    private final UserForgotPasswordRepository userForgotPasswordRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentBlockRepository assessmentBlockRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final CandidateRepository candidateRepository;
    private final QuestionCommentRepository questionCommentRepository;
    private final CryptoService cryptoService;

    //Global
    private final List<AssetFile> assetFiles = new ArrayList<>();
    private final List<EmailLog> emailLogs = new ArrayList<>();
    private final List<SMSLog> smsLogs = new ArrayList<>();

    private final List<Organization> organizations = new ArrayList<>();

    private final List<User> users = new ArrayList<>();
    private final List<UserEmailInvite> userEmailInvites = new ArrayList<>();
    private final List<UserEmailVerification> userEmailVerifications = new ArrayList<>();
    private final List<UserForgotPassword> userForgotPasswords = new ArrayList<>();

    private final List<Assessment> assessments = new ArrayList<>();
    private final List<AssessmentBlock> assessmentBlocks = new ArrayList<>();
    private final List<Question> questions = new ArrayList<>();
    private final List<AnswerOption> answerOptions = new ArrayList<>();

    private final List<Candidate> candidates = new ArrayList<>();
    private final List<QuestionComment> questionComments = new ArrayList<>();

    public MockDataGeneratorService(final PropertiesConfig propertiesConfig,
                                    final FileRepository fileRepository, final SMSRepository smsRepository,
                                    final EmailRepository emailRepository, final OrganizationRepository organizationRepository,
                                    final UserRepository userRepository, final UserEmailInviteRepository userEmailInviteRepository,
                                    final UserEmailVerificationRepository userEmailVerificationRepository,
                                    final UserForgotPasswordRepository userForgotPasswordRepository,
                                    final AssessmentRepository assessmentRepository, final AssessmentBlockRepository assessmentBlockRepository,
                                    final QuestionRepository questionRepository, final AnswerOptionRepository answerOptionRepository,
                                    final CandidateRepository candidateRepository, final QuestionCommentRepository questionCommentRepository,
                                    final CryptoService cryptoService){
        this.propertiesConfig = propertiesConfig;
        this.fileRepository = fileRepository;
        this.emailRepository = emailRepository;
        this.smsRepository = smsRepository;
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.userEmailInviteRepository = userEmailInviteRepository;
        this.userEmailVerificationRepository = userEmailVerificationRepository;
        this.userForgotPasswordRepository = userForgotPasswordRepository;
        this.assessmentRepository = assessmentRepository;
        this.assessmentBlockRepository = assessmentBlockRepository;
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
        this.candidateRepository = candidateRepository;
        this.questionCommentRepository = questionCommentRepository;
        this.cryptoService = cryptoService;
    }

    @Transactional
    public void clearAllData() {
        this.fileRepository.deleteAll();
        this.smsRepository.deleteAll();
        this.emailRepository.deleteAll();

        this.userEmailInviteRepository.deleteAll();
        this.userEmailVerificationRepository.deleteAll();
        this.userForgotPasswordRepository.deleteAll();
        this.userRepository.deleteAll();

        this.answerOptionRepository.deleteAll();
        this.questionRepository.deleteAll();
        this.assessmentBlockRepository.deleteAll();
        this.assessmentRepository.deleteAll();

        this.candidateRepository.deleteAll();
        this.organizationRepository.deleteAll();
        this.questionCommentRepository.deleteAll();
    }

    @Transactional
    public void constructData(){
        buildFiles();
        buildEmailLog();
        buildSMSLog();

        buildOrganizations();

        buildUsers();
        buildUserEmailInvites();
        buildUserEmailVerifications();
        buildUserForgotPasswords();

        buildAssessments();
        buildAssessmentBlocks();
        buildQuestions();
        buildAnswerOptions();

        buildCandidates();
        buildQuestionComments();
    }


    private void buildFiles(){
        AssetFileModel assetFileModel = new AssetFileModel();

        this.assetFiles.clear();
        this.assetFiles.addAll(Instancio.ofList(assetFileModel.getModel()).size(10).create());

        this.fileRepository.saveAll(this.assetFiles);
    }

    private void buildOrganizations() {
        OrganizationModel organizationModel = new OrganizationModel();

        this.organizations.clear();
        this.organizations.addAll(Instancio.ofList(organizationModel.getModel(this.assetFiles)).size(2).create());

        int i=0;
        for(Organization organization:this.organizations){
            organization.setName("Organization " + (++i));
        }
        this.organizationRepository.saveAll(this.organizations);
    }

    private void buildUsers() {
        UserModel userModel = new UserModel();

        this.users.clear();
        this.users.addAll(Instancio.ofList(userModel.getModel(this.assetFiles, this.organizations)).size(4).create());
        this.users.forEach(user -> user.setPassword(this.cryptoService.generatePassword(user.getPassword())));

        int i=0;
        for(User user:this.users){
            user.setName("User " + (++i));
        }
        this.userRepository.saveAll(this.users);
    }

    private void buildUserEmailInvites() {
        UserEmailInviteModel userEmailInviteModel = new  UserEmailInviteModel();

        this.userEmailInvites.clear();
        this.userEmailInvites.addAll(Instancio.ofList(userEmailInviteModel.getModel(this.cryptoService, this.organizations)).size(3).create());
        this.userEmailInviteRepository.saveAll(this.userEmailInvites);
    }

    private void buildUserEmailVerifications(){
        UserEmailVerificationModel userEmailVerificationModel = new  UserEmailVerificationModel();

        this.userEmailVerifications.clear();
        this.userEmailVerifications.addAll(Instancio.ofList(userEmailVerificationModel.getModel(this.cryptoService, this.users)).size(3).create());
        this.userEmailVerificationRepository.saveAll(this.userEmailVerifications);
    }

    private void buildUserForgotPasswords(){
        UserForgotPasswordModel userForgotPasswordModel = new  UserForgotPasswordModel();

        this.userForgotPasswords.clear();
        this.userForgotPasswords.addAll(Instancio.ofList(userForgotPasswordModel.getModel(this.cryptoService, this.users)).size(3).create());
        this.userForgotPasswordRepository.saveAll(this.userForgotPasswords);
    }

    private void buildEmailLog() {
        EmailLogModel emailLogModel = new EmailLogModel();

        this.emailLogs.clear();
        this.emailLogs.addAll(Instancio.ofList(emailLogModel.getModel(this.propertiesConfig)).size(10).create());
        this.emailRepository.saveAll(this.emailLogs);
    }

    private void buildSMSLog() {
        SMSLogModel smsLogModel = new SMSLogModel();

        this.smsLogs.clear();
        this.smsLogs.addAll(Instancio.ofList(smsLogModel.getModel()).size(10).create());
        this.smsRepository.saveAll(this.smsLogs);
    }

    private void buildAssessments() {
        AssessmentModel assessmentModel = new AssessmentModel();

        this.assessments.clear();
        this.assessments.addAll(Instancio.ofList(assessmentModel.getModel(this.organizations, this.assetFiles, this.cryptoService)).size(4).create());

        int i=0;
        for(Assessment assessment:this.assessments){
            assessment.setName("Assessment " + (++i));
        }
        this.assessmentRepository.saveAll(this.assessments);
    }

    private void buildAssessmentBlocks() {
        AssessmentBlockModel assessmentBlockModel = new AssessmentBlockModel();

        this.assessmentBlocks.clear();
        this.assessmentBlocks.addAll(Instancio.ofList(assessmentBlockModel.getModel(this.assessments)).size(8).create());

        Map<Assessment, List<AssessmentBlock>> map = this.assessmentBlocks.stream().collect(Collectors.groupingBy(AssessmentBlock::getAssessment));
        for(Map.Entry<Assessment, List<AssessmentBlock>> entry: map.entrySet()){
            int i=0;
            for(final AssessmentBlock assessmentBlock: entry.getValue()){
                assessmentBlock.setSortOrder(++i);
                assessmentBlock.setTitle("Assessment Block " + i);
            }
        }

        this.assessmentBlockRepository.saveAll(this.assessmentBlocks);
    }

    private void buildQuestions() {
        QuestionModel questionModel = new QuestionModel();

        this.questions.clear();
        this.questions.addAll(Instancio.ofList(questionModel.getModel(this.assessmentBlocks)).size(20).create());

        Map<AssessmentBlock, List<Question>> map = this.questions.stream().collect(Collectors.groupingBy(Question::getAssessmentBlock));
        for(Map.Entry<AssessmentBlock, List<Question>> entry: map.entrySet()){
            int i=0;
            for(final Question question: entry.getValue()){
                question.setSortOrder(++i);
            }
        }

        this.questionRepository.saveAll(this.questions);
    }

    private void buildAnswerOptions() {
        AnswerOptionModel answerOptionModel = new AnswerOptionModel();

        this.answerOptions.clear();
        this.answerOptions.addAll(Instancio.ofList(answerOptionModel.getModel(this.questions)).size(40).create());

        this.answerOptionRepository.saveAll(this.answerOptions);
    }

    private void buildCandidates() {
        CandidateModel candidateModel = new CandidateModel();

        this.candidates.clear();
        this.candidates.addAll(Instancio.ofList(candidateModel.getModel(this.assetFiles)).size(4).create());
        int i=0;
        for(Candidate candidate:this.candidates){
            candidate.setName("Candidate " + (++i));
        }

        this.candidateRepository.saveAll(this.candidates);
    }

    private void buildQuestionComments() {
        QuestionCommentModel questionCommentModel = new QuestionCommentModel();

        this.questionComments.clear();
        this.questionComments.addAll(Instancio.ofList(questionCommentModel.getModel(this.questions, this.candidates)).size(20).create());

        this.questionCommentRepository.saveAll(this.questionComments);
    }

}
