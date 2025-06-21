import { CandidateResponseCodes } from './candidate.response.codes';
import { CreateCandidateReqDto } from './dto/request/create-candidate.req.dto';
import { UpdateCandidateProfileReqDto } from './dto/request/update-candidate.req.dto';
import { CandidateAssessmentRespDto } from './dto/response/candidate-assessment.resp.dto';
import { CandidateRespDto } from './dto/response/candidate.resp.dto';
import { SubmitAnswerReqDto } from './dto/request/submit-answer.req.dto';
import { generateOTP } from 'src/utils/app.utils';
import { REGEX } from 'src/utils/file.utils';
import { QuestionTypeUtils } from 'src/enums/question.type';
import { CandidateResponseRespDto } from './dto/response/candidate-response.resp.dto';
import { GradingService } from '../grading/grading.service';
import { TimeoutConfig } from 'src/config/timeout.config';
import { Injectable } from '@nestjs/common';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { CandidateAssessmentIntroRespDto } from './dto/response/candidate-assessment-intro.resp.dto';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';
import { SmsService } from 'src/providers/sms.service';
import { getQuestionStrategy } from './candidate-question-strategy/question-strategy-factory';
import { IQuestionStrategy } from './interfaces/interface-question-strategy';
import { OrganizationDocumentRepository } from '../organization/organization.document.repository';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { QuestionDocumentRepository } from '../question/question.document.repository';
import { CandidateDocumentRepository } from './candidate.document.repository';
import { CandidateAssessmentDocumentRepository } from './candidate-assessment.document.repository';
import { CandidateResponseDocumentRepository } from './candidate-response.document.repository';
import { CandidateAttemptLogDocumentRepository } from './candidate-attempt-log.document.repository';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { OrganizationDocument } from 'src/schemas/organization.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';
import { CandidateAttemptLogDocument } from 'src/schemas/candidate-attempt-log.schema';
import { AssetFileDocument } from 'src/schemas/asset-file.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { CandidateResponseDocument } from 'src/schemas/candidate-response.schema';

@Injectable()
export class CandidateService {
  constructor(
    private candidateDocumentRepository: CandidateDocumentRepository,
    private organizationDocumentRepository: OrganizationDocumentRepository,
    private assessmentDocumentRepository: AssessmentDocumentRepository,
    private assessmentBlockDocumentRepository: AssessmentBlockDocumentRepository,
    private questionDocumentRepository: QuestionDocumentRepository,
    private candidateAssessmentDocumentRepository: CandidateAssessmentDocumentRepository,
    private candidateResponseDocumentRepository: CandidateResponseDocumentRepository,
    private candidateAttemptLogDocumentRepository: CandidateAttemptLogDocumentRepository,
    private assetFileDocumentRepository: AssetFileDocumentRepository,

    private smsService: SmsService,
    private gradingService: GradingService,
  ) { }

  async getCandidateAssessmentIntro(
    token: string,
  ): Promise<CandidateAssessmentIntroRespDto> {
    const assessmentDocument: AssessmentDocument = await this.assessmentDocumentRepository.findByToken(
      token,
    );

    if (assessmentDocument == null) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN;
    }

    if (assessmentDocument.status == AssessmentStatus.ARCHIVED) {
      throw CandidateResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    const blockCount: number =
      await this.assessmentBlockDocumentRepository.getCountForAssessment(
        assessmentDocument,
      );

    const assessmentBlockDocuments: AssessmentBlockDocument[] =
      await this.assessmentBlockDocumentRepository.findAllForAssessment(assessmentDocument);

    const questionCount: number =
      await this.questionDocumentRepository.getCountForAssessmentBlocks(assessmentBlockDocuments);

    const organization =
      await this.organizationDocumentRepository.findById(
        assessmentDocument.organizationDocument.toString(),
      );

    return new CandidateAssessmentIntroRespDto(
      organization,
      assessmentDocument,
      blockCount,
      questionCount,
    );
  }

  async createCandidate(
    createCandidateReqDto: CreateCandidateReqDto,
  ): Promise<string> {
    let candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findByContactNumber(
      createCandidateReqDto.contact_number,
    );
    if (candidateDocument != null) {
      throw CandidateResponseCodes.CANDIDATE_EXISTS;
    }
    candidateDocument = this.getEntityFromCandidateReqDto(createCandidateReqDto);
    candidateDocument.verification_code = generateOTP();
    candidateDocument.photo = null;
    candidateDocument = await this.candidateDocumentRepository.save(candidateDocument);
    // TODO: Add code to send verification code to user here
    /* this.smsService.sendOtp(
       candidate.contactNumber,
       candidate.verificationCode,
     );*/
    return candidateDocument.id;
  }

  async verifyCandidateOTP(
    candidateId: string,
    verificationCode: number,
  ): Promise<CandidateDocument> {
    const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(candidateId);
    if (candidateDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }

    if (candidateDocument.verification_code != verificationCode) {
      throw CandidateResponseCodes.INVALID_VERIFICATION_CODE;
    }

    if (candidateDocument.verified) {
      throw CandidateResponseCodes.CANDIDATE_ALREADY_VERIFIED;
    }
    candidateDocument.verified = true;
    await this.candidateDocumentRepository.save(candidateDocument);
    return candidateDocument;
  }

  async sendCandidateOTP(candidateId: string) {
    const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(candidateId);

    if (candidateDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }
    candidateDocument.verification_code = generateOTP();
    candidateDocument.verified = false;
    await this.candidateDocumentRepository.save(candidateDocument);
    // TODO: Add code to send verification code to user here
    this.smsService.sendOtp(
      candidateDocument.contact_number,
      candidateDocument.verification_code,
    );
  }

  async getCandidateByContactNumber(
    contactNumber: string,
  ): Promise<CandidateRespDto> {
    const candidateDocument: CandidateDocument =
      await this.candidateDocumentRepository.findByContactNumber(contactNumber);
    if (candidateDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_CONTACT_NUMBER;
    }
    return new CandidateRespDto(candidateDocument);
  }

  async getCandidateById(id: string): Promise<CandidateRespDto> {
    const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(id);
    if (candidateDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }
    return new CandidateRespDto(candidateDocument);
  }

  async searchByNameForOrganization(organizationId: string, candidateName: string) {
    const organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findById(organizationId);
    this.throwIfOrganizationNotDefined(organizationDocument);

    const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);

    const candidateAssessmentDocuments: CandidateAssessmentDocument[] =
      await this.candidateAssessmentDocumentRepository.findAllForAssessments(assessmentDocuments);

    const candidateIds = [];
    candidateAssessmentDocuments.forEach(ca => {
      if (candidateIds.indexOf(ca.candidateDocument.toString()) == -1) {
        candidateIds.push(ca.candidateDocument.toString())
      }
    });

    const candidateDocuments: CandidateDocument[] = await this.candidateDocumentRepository.findAllByIds(candidateIds);

    const candidateResponseDtos: CandidateRespDto[] = [];
    candidateDocuments.forEach(candidateDocument => {
      if (candidateDocument.name == candidateName) {
        candidateResponseDtos.push(new CandidateRespDto(candidateDocument));
      }
    });
    return candidateResponseDtos;
  }

  async getCandidateAssessmentByToken(
    candidateId: string,
    token: string,
  ): Promise<CandidateAssessmentRespDto> {
    const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(candidateId);
    const assessmentDocument: AssessmentDocument = await this.assessmentDocumentRepository.findByToken(token);

    if (candidateDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }

    if (assessmentDocument == null) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN;
    }

    const candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
        candidateDocument,
        assessmentDocument,
      );

    if (candidateAssessmentDocument == null) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }
    if (
      TimeoutConfig.isExpired(
        candidateAssessmentDocument.start_date,
        TimeoutConfig.ASSESSMENT_DURATION,
      )
    ) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_TIMED_OUT;
    }

    const candidateAssessmentRespDto: CandidateAssessmentRespDto =
      new CandidateAssessmentRespDto(candidateAssessmentDocument);

    return candidateAssessmentRespDto;
  }

  async getCandidateAssessmentByAssessmentId(
    candidateId: string,
    assessmentId: string,
  ): Promise<CandidateAssessmentRespDto> {

    const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(candidateId);
    const assessmentDocument: AssessmentDocument = await this.assessmentDocumentRepository.findById(assessmentId);

    if (candidateDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }

    if (assessmentDocument == null) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_ID;
    }

    const candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
        candidateDocument,
        assessmentDocument,
      );

    if (candidateAssessmentDocument == null) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }

    const candidateAssessmentRespDto: CandidateAssessmentRespDto =
      new CandidateAssessmentRespDto(candidateAssessmentDocument);

    return candidateAssessmentRespDto;
  }

  async createCandidateAssessment(
    candidateId: string,
    token: string,
  ): Promise<string> {
    const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(
      candidateId,
    );

    if (candidateDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }

    let candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findByCandidate(candidateDocument);

    let assessmentDocument: AssessmentDocument;

    if (candidateAssessmentDocument) {
      assessmentDocument = await this.assessmentDocumentRepository.findById(candidateAssessmentDocument.assessmentDocument.toString());
      if (assessmentDocument.token == token) {
        throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_EXISTS;
      }
    }

    assessmentDocument = await this.assessmentDocumentRepository.findByToken(token);

    if (assessmentDocument == null) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN;
    }
    if (assessmentDocument.status != AssessmentStatus.ACTIVE) {
      throw CandidateResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    const assessmenBlockDocuments: AssessmentBlockDocument[] = await this.assessmentBlockDocumentRepository.findAllForAssessment(assessmentDocument);

    candidateAssessmentDocument = this.candidateAssessmentDocumentRepository.getModelInstance();
    candidateAssessmentDocument.start_date = new Date();
    candidateAssessmentDocument.status = CandidateAssessmentStatus.IN_PROGRESS;
    candidateAssessmentDocument.assessmentBlockDocument = assessmenBlockDocuments[0];
    candidateAssessmentDocument.candidateDocument = candidateDocument;
    candidateAssessmentDocument.assessmentDocument = assessmentDocument;

    await this.candidateAssessmentDocumentRepository.save(candidateAssessmentDocument);
    return candidateAssessmentDocument.id;
  }

  async logAssessmentAttempt(
    candidateId: string,
    assessmentId: string,
  ): Promise<void> {
    const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(
      candidateId,
    );
    const assessmentDocument: AssessmentDocument = await this.assessmentDocumentRepository.findById(
      assessmentId,
    );

    if (candidateDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }
    if (assessmentDocument == null) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_ID;
    }
    if (assessmentDocument.status != AssessmentStatus.ACTIVE) {
      throw CandidateResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    const candidateAttemptLogDocument: CandidateAttemptLogDocument = this.candidateAttemptLogDocumentRepository.getModelInstance();
    candidateAttemptLogDocument.candidateDocument = candidateDocument;
    candidateAttemptLogDocument.assessmentDocument = assessmentDocument;
    this.candidateAttemptLogDocumentRepository.save(candidateAttemptLogDocument);
  }

  async updateCandidateProfile(
    candidateId: string,
    updateCandidateProfileReqDto: UpdateCandidateProfileReqDto,
  ) {
    let photoFile: AssetFileDocument = null;
    if (updateCandidateProfileReqDto.photo_id != null) {
      photoFile = await this.assetFileDocumentRepository.findById(
        updateCandidateProfileReqDto.photo_id,
      );
      if (photoFile == null) {
        throw CandidateResponseCodes.INVALID_PHOTO_FILE_ID;
      }
      if (!photoFile.mime_type.match(REGEX.ALLOWED_IMAGE_FILE_EXTENSIONS)) {
        throw CandidateResponseCodes.INVALID_PHOTO_FILE_ID;
      }
    }

    let candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findByEmail(
      updateCandidateProfileReqDto.email,
    );
    if (candidateDocument != null && candidateDocument.id != candidateId) {
      throw CandidateResponseCodes.CANDIDATE_EMAIL_EXISTS;
    }

    candidateDocument = await this.candidateDocumentRepository.findById(candidateId);
    if (candidateDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
    }

    candidateDocument.name = updateCandidateProfileReqDto.name;
    candidateDocument.email = updateCandidateProfileReqDto.email;
    candidateDocument.photo = photoFile;
    await this.candidateDocumentRepository.save(candidateDocument);
  }

  async setActiveAssessmentBlock(
    candidateAssessmentId: string,
    assessmentBlockId: string,
  ) {
    const candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findById(
        candidateAssessmentId,
      );

    if (candidateAssessmentDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID;
    }
    if (candidateAssessmentDocument.status != CandidateAssessmentStatus.IN_PROGRESS) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
    }

    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(
        assessmentBlockId,
      );
    if (
      assessmentBlockDocument == null ||
      assessmentBlockDocument.assessmentDocument.toString() != candidateAssessmentDocument.assessmentDocument.toString()
    ) {
      throw CandidateResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }

    candidateAssessmentDocument.assessmentBlockDocument = assessmentBlockDocument;
    this.candidateAssessmentDocumentRepository.save(candidateAssessmentDocument);
  }

  async markCandidateAssessmentComplete(candidateAssessmentId: string) {
    const candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findById(candidateAssessmentId);

    if (candidateAssessmentDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID;
    }
    if (candidateAssessmentDocument.status != CandidateAssessmentStatus.IN_PROGRESS) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
    }
    candidateAssessmentDocument.status = CandidateAssessmentStatus.GRADING_PENDING;
    candidateAssessmentDocument.end_date = new Date();
    await this.candidateAssessmentDocumentRepository.save(candidateAssessmentDocument);
  }

  async submitAnswer(
    candidateAssessmentId: string,
    questionId: string,
    submitAnswerReqDto: SubmitAnswerReqDto,
  ) {
    const candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findById(
        candidateAssessmentId,
      );

    if (candidateAssessmentDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID;
    }

    if (candidateAssessmentDocument.status != CandidateAssessmentStatus.IN_PROGRESS) {
      throw CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
    }

    const questionDocument: QuestionDocument =
      await this.questionDocumentRepository.findById(questionId);
    if (questionDocument == null) {
      throw CandidateResponseCodes.INVALID_QUESTION_ID;
    }

    if (questionDocument.assessmentBlockDocument.toString() != candidateAssessmentDocument.assessmentBlockDocument.toString()) {
      throw CandidateResponseCodes.ASSESSMENT_BLOCK_QUESTION_MISMATCH;
    }

    const questionStrategy: IQuestionStrategy = getQuestionStrategy(
      submitAnswerReqDto,
      questionDocument,
      this.questionDocumentRepository,
      this.assetFileDocumentRepository,
    );

    await questionStrategy.validate();

    this.candidateAssessmentDocumentRepository.deleteResponseForCandidateAssessmentAndQuestion(candidateAssessmentDocument, questionDocument);

    const candidateResponseDocument: CandidateResponseDocument = this.candidateResponseDocumentRepository.getModelInstance();
    candidateResponseDocument.questionDocument = questionDocument;
    if (QuestionTypeUtils.isAutoScored(questionDocument.type)) {
      candidateResponseDocument.answers = submitAnswerReqDto.answer_ids.join();
      candidateResponseDocument.answer_text = "";
      candidateResponseDocument.assetFileDocument = null;
    } else {
      if (QuestionTypeUtils.isFile(questionDocument.type)) {
        const file: AssetFileDocument = await this.assetFileDocumentRepository.findById(submitAnswerReqDto.file_id);
        candidateResponseDocument.answers = "";
        candidateResponseDocument.answer_text = submitAnswerReqDto.answer_text;
        candidateResponseDocument.assetFileDocument = file;
      } else {
        candidateResponseDocument.answers = "";
        candidateResponseDocument.answer_text = submitAnswerReqDto.answer_text;
        candidateResponseDocument.assetFileDocument = null;
      }
    }
    candidateAssessmentDocument.candidateResponseDocuments.push(candidateResponseDocument);

    await this.candidateAssessmentDocumentRepository.save(candidateAssessmentDocument);

    if (QuestionTypeUtils.isAutoScored(questionDocument.type)) {
      await this.gradingService.autoScoreAndSaveCandidateResponseScore(
        candidateAssessmentDocument.candidateDocument,
        questionDocument,
        questionStrategy,
      );
    }
  }

  async getResponsesByQuestionId(
    candidateAssessmentId: string,
    questionId: string,
  ): Promise<CandidateResponseRespDto[]> {
    const candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findById(candidateAssessmentId);

    if (candidateAssessmentDocument == null) {
      throw CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID;
    }

    const questionDocument: QuestionDocument = await this.questionDocumentRepository.findById(questionId);

    if (questionDocument == null) {
      throw CandidateResponseCodes.INVALID_QUESTION_ID;
    }

    const candidateResponseDocuments: CandidateResponseDocument[] =
      await this.candidateAssessmentDocumentRepository.findResponsesByCandidateAssessmentAndQuestion(
        candidateAssessmentDocument,
        questionDocument,
      );

    const candidateResponseRespDtoList = [];
    candidateResponseDocuments.forEach(candidateResponseDocument => {
      candidateResponseRespDtoList.push(
        new CandidateResponseRespDto(candidateResponseDocument),
      );
    });

    return candidateResponseRespDtoList;
  }

  private throwIfOrganizationNotDefined(organizationDocument: OrganizationDocument) {
    if (organizationDocument == null) {
      throw CandidateResponseCodes.INVALID_ORGANIZATION_ID;
    }
  }

  private getEntityFromCandidateReqDto(
    createCandidateReqDto: CreateCandidateReqDto,
  ): CandidateDocument {
    const candidateDocument: CandidateDocument = this.candidateDocumentRepository.getModelInstance();
    candidateDocument.name = '';
    candidateDocument.email = '';
    candidateDocument.contact_number = createCandidateReqDto.contact_number;
    return candidateDocument;
  }
}
