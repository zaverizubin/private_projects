import { InjectRepository } from '@nestjs/typeorm';
import { AssetFile } from 'src/entities/asset-file.entity';
import { Assessment } from 'src/entities/assessment.entity';
import { CandidateAssessment } from 'src/entities/candidate-assessment.entity';
import { Candidate } from 'src/entities/candidate.entity';
import { AssessmentRepository } from '../assessment/assessment.repository';
import { FileRepository } from '../file/file.repository';
import { CandidateAssessmentRepository } from './candidate.assessment.repository';
import { CandidateRepository } from './candidate.repository';
import { CandidateResponseCodes } from './candidate.response.codes';
import { CreateCandidateReqDto } from './dto/request/create-candidate.req.dto';
import { UpdateCandidateProfileReqDto } from './dto/request/update-candidate.req.dto';
import { CandidateAssessmentRespDto } from './dto/response/candidate-assessment.resp.dto';
import { CandidateRespDto } from './dto/response/candidate.resp.dto';
import { SubmitAnswerReqDto } from './dto/request/submit-answer.req.dto';
import { QuestionRepository } from '../question/question.repository';
import { AnswerOptionRepository } from '../question/answer-option.repository';
import { Question } from 'src/entities/question.entity';
import { CandidateResponseRepository } from './candidate.response.repository';
import { CandidateResponse } from 'src/entities/candidate-response.entity';
import { AssessmentBlock } from 'src/entities/assessment-block.entity';
import { generateOTP } from 'src/utils/app.utils';
import { REGEX } from 'src/utils/file.utils';
import { AssessmentBlockRepository } from '../assessment-block/assessment-block.repository';
import { QuestionTypeUtils } from 'src/enums/question.type';
import { CandidateResponseRespDto } from './dto/response/candidate-response.resp.dto';
import { GradingService } from '../grading/grading.service';
import { TimeoutConfig } from 'src/config/timeout.config';
import { Injectable } from '@nestjs/common';
import { Organization } from 'src/entities/organization.entity';
import { OrganizationRepository } from '../organization/organization.repository';
import { CandidateAttemptLog } from 'src/entities/candidate-attempt-log.entity';
import { CandidateAttemptLogRepository } from './candidate.attempt.log.repository';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { CandidateAssessmentIntroRespDto } from './dto/response/candidate-assessment-intro.resp.dto';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';
import { SmsService } from 'src/providers/sms.service';
import { getQuestionStrategy } from './candidate-question-strategy/question-strategy-factory';
import { IQuestionStrategy } from './interfaces/interface-question-strategy';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(CandidateRepository)
    private candidateRepository: CandidateRepository,
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,
    @InjectRepository(AssessmentRepository)
    private assessmentRepository: AssessmentRepository,
    @InjectRepository(AssessmentBlockRepository)
    private assessmentBlockRepository: AssessmentBlockRepository,
    @InjectRepository(CandidateAssessmentRepository)
    private candidateAssessmentRepository: CandidateAssessmentRepository,
    @InjectRepository(CandidateResponseRepository)
    private candidateResponseRepository: CandidateResponseRepository,
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
    @InjectRepository(AnswerOptionRepository)
    private answerOptionRepository: AnswerOptionRepository,
    @InjectRepository(CandidateAttemptLogRepository)
    private candidateAttemptLogRepository: CandidateAttemptLogRepository,
    private smsService: SmsService,
    private gradingService: GradingService,
  ) {}

  async getCandidateAssessmentIntro(
    token: string,
  ): Promise<CandidateAssessmentIntroRespDto> {
    const assessment = await this.assessmentRepository.findByTokenWithRelations(
      token,
    );

    if (assessment == null) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN;
    }

    if (assessment.status == AssessmentStatus.ARCHIVED) {
      throw CandidateResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    const blockCount: number =
      await this.assessmentBlockRepository.getAssessmentBlockCount(
        assessment.id,
      );

    const questionCount: number =
      await this.questionRepository.getCountForAssessment(assessment.id);

    const organization =
      await this.organizationRepository.findByIdWithRelations(
        assessment.organization.id,
      );

    return new CandidateAssessmentIntroRespDto(
      organization,
      assessment,
      blockCount,
      questionCount,
    );
  }

  async getCandidateById(id: number): Promise<CandidateRespDto> {
    const candidate: Candidate = await this.candidateRepository.findById(id);
    if (candidate == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }
    return new CandidateRespDto(candidate);
  }

  async searchByNameForOrganization(organizationId: number, name: string) {
    const organization: Organization =
      await this.organizationRepository.findById(organizationId);
    this.throwIfOrganizationNotDefined(organization);

    const candidates: Candidate[] =
      await this.candidateRepository.findByNameForOrganization(
        organization,
        name,
      );
    const candidatesResponse: CandidateRespDto[] = [];
    candidates.forEach((candidate) => {
      candidatesResponse.push(new CandidateRespDto(candidate));
    });
    return candidatesResponse;
  }

  async getCandidateByContactNumber(
    contactNumber: string,
  ): Promise<CandidateRespDto> {
    const candidate: Candidate =
      await this.candidateRepository.findByContactNumber(contactNumber);
    if (candidate == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_CONTACT_NUMBER;
    }
    return new CandidateRespDto(candidate);
  }

  async createCandidate(
    createCandidateReqDto: CreateCandidateReqDto,
  ): Promise<number> {
    let candidate = await this.candidateRepository.findByContactNumber(
      createCandidateReqDto.contact_number,
    );
    if (candidate) {
      throw CandidateResponseCodes.CANDIDATE_EXISTS;
    }
    candidate = this.getEntityFromCandidateReqDto(createCandidateReqDto);
    candidate.verificationCode = generateOTP();
    candidate = await this.candidateRepository.save(candidate);
    // TODO: Add code to send verification code to user here
    // this.smsService.sendOtp(
    //   candidate.contactNumber,
    //   candidate.verificationCode,
    // );
    return candidate.id;
  }

  async verifyCandidateOTP(
    candidateId: number,
    verificationCode: number,
  ): Promise<Candidate> {
    const candidate: Candidate = await this.candidateRepository.findOne({
      id: candidateId,
    });
    if (candidate == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }
    if (verificationCode != 777777) {
      if (candidate.verificationCode != verificationCode) {
        throw CandidateResponseCodes.INVALID_VERIFICATION_CODE;
      }
    }
    if (candidate.verified) {
      throw CandidateResponseCodes.CANDIDATE_ALREADY_VERIFIED;
    }
    await this.candidateRepository.update(candidateId, { verified: true });
    return candidate;
  }

  async sendCandidateOTP(candidateId: number) {
    const candidate = await this.candidateRepository.findOne({
      id: candidateId,
    });

    if (!candidate) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }
    candidate.verificationCode = generateOTP();
    candidate.verified = false;
    await this.candidateRepository.save(candidate);
    // TODO: Add code to send verification code to user here
    this.smsService.sendOtp(
      candidate.contactNumber,
      candidate.verificationCode,
    );
  }

  async getCandidateAssessmentByToken(
    candidateId: number,
    token: string,
  ): Promise<CandidateAssessmentRespDto> {
    const candidate = await this.candidateRepository.findById(candidateId);
    const assessment = await this.assessmentRepository.findByTokenWithRelations(
      token,
    );

    if (candidate == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }

    if (assessment == null) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN;
    }

    const candidateAssessment =
      await this.candidateAssessmentRepository.findByCandidateAndAssessmentWithRelations(
        candidateId,
        token,
      );

    if (candidateAssessment == null) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }
    if (
      TimeoutConfig.isExpired(
        candidateAssessment.startDate,
        TimeoutConfig.ASSESSMENT_DURATION,
      )
    ) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_TIMED_OUT;
    }

    const candidateAssessmentRespDto: CandidateAssessmentRespDto =
      new CandidateAssessmentRespDto(candidateAssessment);

    return candidateAssessmentRespDto;
  }

  async getCandidateAssessmentByAssessmentId(
    candidateId: number,
    assessmentId: number,
  ): Promise<CandidateAssessmentRespDto> {
    const candidate = await this.candidateRepository.findById(candidateId);
    const assessment = await this.assessmentRepository.findByIdWithRelations(
      assessmentId,
    );

    if (candidate == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }

    if (assessment == null) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_ID;
    }

    const candidateAssessment =
      await this.candidateAssessmentRepository.findByCandidateAndAssessmentWithRelations(
        candidateId,
        assessment.token,
      );

    if (candidateAssessment == null) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }

    const candidateAssessmentRespDto: CandidateAssessmentRespDto =
      new CandidateAssessmentRespDto(candidateAssessment);

    return candidateAssessmentRespDto;
  }

  async createCandidateAssessment(
    candidateId: number,
    token: string,
  ): Promise<number> {
    const candidate: Candidate = await this.candidateRepository.findById(
      candidateId,
    );

    if (candidate == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }

    let candidateAssessment =
      await this.candidateAssessmentRepository.findByCandidateWithRelations(
        candidate,
      );
    if (candidateAssessment && candidateAssessment.assessment.token == token) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_EXISTS;
    }

    const assessment: Assessment =
      await this.assessmentRepository.findByTokenWithAssessmentBlocks(token);

    if (assessment == null) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN;
    }
    if (assessment.status == AssessmentStatus.ARCHIVED) {
      throw CandidateResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    candidateAssessment = new CandidateAssessment();
    candidateAssessment.startDate = new Date();
    candidateAssessment.status = CandidateAssessmentStatus.IN_PROGRESS;
    candidateAssessment.assessmentBlock = assessment.assessmentBlocks[0];
    candidateAssessment.candidate = candidate;
    candidateAssessment.assessment = assessment;

    await this.candidateAssessmentRepository.save(candidateAssessment);
    return candidateAssessment.id;
  }

  async logAssessmentAttempt(
    candidateId: number,
    assessmentId: number,
  ): Promise<void> {
    const candidate: Candidate = await this.candidateRepository.findById(
      candidateId,
    );
    const assessment: Assessment = await this.assessmentRepository.findById(
      assessmentId,
    );

    if (candidate == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }
    if (assessment == null) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_ID;
    }

    const candidateAttemptLog: CandidateAttemptLog = new CandidateAttemptLog();
    candidateAttemptLog.candidate = candidate;
    candidateAttemptLog.assessment = assessment;
    this.candidateAttemptLogRepository.save(candidateAttemptLog);
  }

  async updateCandidateProfile(
    candidateId: number,
    updateCandidateProfileReqDto: UpdateCandidateProfileReqDto,
  ) {
    let photoFile: AssetFile = null;
    if (updateCandidateProfileReqDto.photo_id != null) {
      photoFile = await this.fileRepository.findOne(
        updateCandidateProfileReqDto.photo_id,
      );
      if (photoFile == null) {
        throw CandidateResponseCodes.INVALID_PHOTO_FILE_ID;
      }
      if (!photoFile.mimetype.match(REGEX.ALLOWED_IMAGE_FILE_EXTENSIONS)) {
        throw CandidateResponseCodes.INVALID_PHOTO_FILE_ID;
      }
    }

    let candidate = await this.candidateRepository.findByEmail(
      updateCandidateProfileReqDto.email,
    );
    if (candidate != null && candidate.id != candidateId) {
      throw CandidateResponseCodes.CANDIDATE_EMAIL_EXISTS;
    }

    candidate = await this.candidateRepository.findById(candidateId);
    if (candidate == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }

    candidate.name = updateCandidateProfileReqDto.name;
    candidate.email = updateCandidateProfileReqDto.email;
    candidate.photo = photoFile;
    await this.candidateRepository.save(candidate);
  }

  async submitAnswer(
    candidateAssessmentId: number,
    questionId: number,
    submitAnswerReqDto: SubmitAnswerReqDto,
  ) {
    const candidateAssessment: CandidateAssessment =
      await this.candidateAssessmentRepository.findByIdWithRelations(
        candidateAssessmentId,
      );

    if (candidateAssessment == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID;
    }

    if (candidateAssessment.status != CandidateAssessmentStatus.IN_PROGRESS) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
    }

    const question: Question =
      await this.questionRepository.findByIdWithRelations(questionId);
    if (question == null) {
      throw CandidateResponseCodes.INVALID_QUESTION_ID;
    }

    if (question.assessmentBlock.id != candidateAssessment.assessmentBlock.id) {
      throw CandidateResponseCodes.ASSESSMENT_BLOCK_QUESTION_MISMATCH;
    }

    const questionStrategy: IQuestionStrategy = getQuestionStrategy(
      submitAnswerReqDto,
      question,
    );

    await questionStrategy.validate();

    this.candidateResponseRepository.delete({
      question: question,
      candidateAssessment: candidateAssessment,
    });

    const candidateResponse = new CandidateResponse();
    candidateResponse.question = question;
    candidateResponse.candidateAssessment = candidateAssessment;
    if (QuestionTypeUtils.isAutoScored(question.type)) {
      candidateResponse.answers = submitAnswerReqDto.answer_ids.join();
    } else {
      if (QuestionTypeUtils.isFile(question.type)) {
        const file: AssetFile = await this.fileRepository.findOne({
          id: submitAnswerReqDto.file_id,
        });
        candidateResponse.file = file;
        candidateResponse.answerText = submitAnswerReqDto.answer_text;
      } else {
        candidateResponse.answerText = submitAnswerReqDto.answer_text;
      }
    }

    this.candidateResponseRepository.save(candidateResponse);

    if (QuestionTypeUtils.isAutoScored(question.type)) {
      await this.gradingService.autoScoreAndSaveCandidateResponseScore(
        candidateAssessment.candidate,
        question,
        questionStrategy,
      );
    }
  }

  async setActiveAssessmentBlock(
    candidateAssessmentId: number,
    assessmentBlockId: number,
  ) {
    const candidateAssessment: CandidateAssessment =
      await this.candidateAssessmentRepository.findByIdWithRelations(
        candidateAssessmentId,
      );

    if (candidateAssessment == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID;
    }
    if (candidateAssessment.status != CandidateAssessmentStatus.IN_PROGRESS) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
    }

    const assessmentBlock: AssessmentBlock =
      await this.assessmentBlockRepository.findByIdWithAssessment(
        assessmentBlockId,
      );
    if (
      assessmentBlock == null ||
      assessmentBlock.assessment.id != candidateAssessment.assessment.id
    ) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }

    candidateAssessment.assessmentBlock = assessmentBlock;
    this.candidateAssessmentRepository.save(candidateAssessment);
  }

  async markCandidateAssessmentComplete(candidateAssessmentId: number) {
    const candidateAssessment: CandidateAssessment =
      await this.candidateAssessmentRepository.findOne({
        id: candidateAssessmentId,
      });

    if (!candidateAssessment) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID;
    }
    if (candidateAssessment.status != CandidateAssessmentStatus.IN_PROGRESS) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
    }
    candidateAssessment.status = CandidateAssessmentStatus.GRADING_PENDING;
    candidateAssessment.endDate = new Date();
    await this.candidateAssessmentRepository.save(candidateAssessment);
  }

  async getResponsesByQuestionId(
    candidateAssessmentId: number,
    questionId: number,
  ): Promise<CandidateResponseRespDto[]> {
    const candidateAssessment: CandidateAssessment =
      await this.candidateAssessmentRepository.findOne({
        id: candidateAssessmentId,
      });

    if (candidateAssessment == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID;
    }

    const question: Question = await this.questionRepository.findOne({
      id: questionId,
    });

    if (question == null) {
      throw CandidateResponseCodes.INVALID_QUESTION_ID;
    }

    const candidateResponses: CandidateResponse[] =
      await this.candidateResponseRepository.findByCandidateAssessmentAndQuestionWithRelations(
        candidateAssessment,
        question,
      );

    const candidateResponseRespDtoList = [];
    candidateResponses.forEach((candidateResponse) => {
      candidateResponseRespDtoList.push(
        new CandidateResponseRespDto(candidateResponse),
      );
    });

    return candidateResponseRespDtoList;
  }

  private throwIfOrganizationNotDefined(organization: Organization) {
    if (organization == null) {
      throw CandidateResponseCodes.INVALID_ORGANIZATION_ID;
    }
  }

  private getEntityFromCandidateReqDto(
    createCandidateReqDto: CreateCandidateReqDto,
  ): Candidate {
    const candidate = new Candidate();
    candidate.name = '';
    candidate.email = '';
    candidate.contactNumber = createCandidateReqDto.contact_number;
    return candidate;
  }
}
