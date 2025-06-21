import { Injectable } from '@nestjs/common';
import { AssessmentDecision } from 'src/enums/assessment.decision';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';
import { QuestionType } from 'src/enums/question.type';

import { IQuestionStrategy } from '../candidate/interfaces/interface-question-strategy';
import { QuestionCommentReqDto } from './dto/request/question-comment.req.dto';
import { QuestionScoreReqDto } from './dto/request/question-score.req.dto';
import { AssessmentQuestionScoreRespDto } from './dto/response/assessment-question-score.resp.dto';
import { QuestionCommentRespDto } from './dto/response/question-comment.resp.dto';
import { GradingResponseCodes } from './grading.response.codes';

import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { CandidateAssessmentDocumentRepository } from '../candidate/candidate-assessment.document.repository';
import { CandidateDocumentRepository } from '../candidate/candidate.document.repository';
import { QuestionDocumentRepository } from '../question/question.document.repository';
import { QuestionCommentDocumentRepository } from './question-comment.document.repository';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { CandidateResponseScoreDocument } from 'src/schemas/candidate-response-score.schema';
import { CandidateResponseScoreDocumentRepository } from './candidate-response-score.document.repository';
import { QuestionCommentDocument } from 'src/schemas/question-comment.schema';
import { CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';
import { CandidateResponseDocument } from 'src/schemas/candidate-response.schema';

@Injectable()
export class GradingService {
  constructor(
    private candidateResponseScoreDocumentRepository: CandidateResponseScoreDocumentRepository,
    private candidateDocumentRepository: CandidateDocumentRepository,
    private assessmentDocumentRepository: AssessmentDocumentRepository,
    private assessmentBlockDocumentRepository: AssessmentBlockDocumentRepository,
    private questionDocumentRepository: QuestionDocumentRepository,
    private candidateAssessmentDocumentRepository: CandidateAssessmentDocumentRepository,
    private questionCommentDocumentRepository: QuestionCommentDocumentRepository,
  ) { }

  async getCandidateScoresByAssessment(
    candidateId: string,
    assessmentId: string,
  ): Promise<AssessmentQuestionScoreRespDto[]> {
    const candidateDocument: CandidateDocument = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessmentDocument: AssessmentDocument = await this.getAssessmentByIdOrThrow(
      assessmentId,
    );

    const candidateResponseScoreDocuments: CandidateResponseScoreDocument[] =
      await this.candidateResponseScoreDocumentRepository.getForCandidateAndAssessment(
        candidateDocument,
        assessmentDocument,
      );
    const assessmentQuestionScoreRespDtos: AssessmentQuestionScoreRespDto[] =
      [];

    candidateResponseScoreDocuments.forEach(candidateResponseScoreDocument => {
      assessmentQuestionScoreRespDtos.push(
        new AssessmentQuestionScoreRespDto(candidateResponseScoreDocument),
      );
    });
    return assessmentQuestionScoreRespDtos;
  }

  async getCandidateScoresByAssessmentBlock(
    candidateId: string,
    assessmentBlockId: string,
  ): Promise<AssessmentQuestionScoreRespDto[]> {
    const candidateDocument: CandidateDocument = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.getAssessmentBlockByIdOrThrow(assessmentBlockId);

    const candidateResponseScoreDocuments: CandidateResponseScoreDocument[] =
      await this.candidateResponseScoreDocumentRepository.getForCandidateAndAssessmentBlock(
        candidateDocument,
        assessmentBlockDocument,
      );
    const assessmentQuestionScoreRespDtos: AssessmentQuestionScoreRespDto[] =
      [];

    candidateResponseScoreDocuments.forEach(candidateResponseScoreDocument => {
      assessmentQuestionScoreRespDtos.push(
        new AssessmentQuestionScoreRespDto(candidateResponseScoreDocument),
      );
    });
    return assessmentQuestionScoreRespDtos;
  }

  async getCandidateUnScoredQuestionsForAssessment(
    candidateId: string,
    assessmentId: string,
  ): Promise<string[]> {
    const candidateDocument: CandidateDocument = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessmentDocument: AssessmentDocument = await this.getAssessmentByIdOrThrow(
      assessmentId,
    );

    const assessmentBlockDocuments: AssessmentBlockDocument[] = await this.assessmentBlockDocumentRepository.findAllForAssessment(assessmentDocument);

    let questionDocuments: QuestionDocument[] = [];

    for (let i = 0; i < assessmentBlockDocuments.length; i++) {
      questionDocuments = questionDocuments.concat(await this.questionDocumentRepository.findAllForAssessmentBlock(assessmentBlockDocuments[i]));
    }

    const candidateResponseScoreDocuments: CandidateResponseScoreDocument[] =
      await this.candidateResponseScoreDocumentRepository.getForCandidateAndAssessment(
        candidateDocument,
        assessmentDocument,
      );

    const unscoredQuestionIds: string[] = [];
    for (let i = 0; i < questionDocuments.length; i++) {
      if (
        questionDocuments[i].type != QuestionType.TEXT_RESPONSE &&
        questionDocuments[i].type != QuestionType.VIDEO_RESPONSE &&
        questionDocuments[i].type != QuestionType.FILE_RESPONSE
      ) {
        continue;
      }
      const candidateResponseScoreDocument: CandidateResponseScoreDocument =
        candidateResponseScoreDocuments.find(
          (crs) => crs.questionDocument.toString() == questionDocuments[i].id,
        );
      const candidateAssessmentDocument: CandidateAssessmentDocument = await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
        candidateDocument,
        assessmentDocument
      );
      const candidateResponseDocument: CandidateResponseDocument =
        candidateAssessmentDocument.candidateResponseDocuments.find(
          (cr) => cr.questionDocument.toString() == questionDocuments[i].id,
        );

      if (candidateResponseScoreDocument == null && candidateResponseDocument != null) {
        unscoredQuestionIds.push(questionDocuments[i].id);
      }
    }
    return unscoredQuestionIds;
  }

  async getCandidateQuestionComments(
    candidateId: string,
    questionId: string,
  ): Promise<QuestionCommentRespDto[]> {
    const candidateDocument: CandidateDocument = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const questionDocument: QuestionDocument = await this.getQuestionByIdOrThrow(questionId);

    const questionCommentDocuments: QuestionCommentDocument[] =
      await this.questionCommentDocumentRepository.findAllForCandidateAndQuestion(
        candidateDocument,
        questionDocument,
      );

    const questionCommentRespDtos: QuestionCommentRespDto[] = [];
    questionCommentDocuments.forEach(questionCommentDocument => {
      questionCommentRespDtos.push(new QuestionCommentRespDto(questionCommentDocument));
    });

    return questionCommentRespDtos;
  }

  async saveCandidateQuestionComment(
    candidateId: string,
    questionId: string,
    questionCommentReqDto: QuestionCommentReqDto,
  ) {
    const candidateDocument: CandidateDocument = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const questionDocument: QuestionDocument = await this.getQuestionByIdOrThrow(questionId);

    let questionCommentDocument: QuestionCommentDocument =
      await this.questionCommentDocumentRepository.getForCandidateQuestionAndUsername(
        candidateDocument,
        questionDocument,
        questionCommentReqDto.username,
      );
    if (questionCommentDocument != null) {
      questionCommentDocument.comment = questionCommentReqDto.comment;
    } else {
      questionCommentDocument = this.questionCommentDocumentRepository.getModelInstance();
      questionCommentDocument.candidateDocument = candidateDocument;
      questionCommentDocument.questionDocument = questionDocument;
      questionCommentDocument.username = questionCommentReqDto.username;
      questionCommentDocument.comment = questionCommentReqDto.comment;
    }

    this.questionCommentDocumentRepository.save(questionCommentDocument);
  }

  async saveCandidateResponseScore(
    candidateId: string,
    questionScoreReqDto: QuestionScoreReqDto,
  ) {
    const candidateDocument: CandidateDocument = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessmentDocument: AssessmentDocument = await this.getAssessmentByIdOrThrow(
      questionScoreReqDto.assessment_id,
    );

    if (assessmentDocument.status != AssessmentStatus.ACTIVE) {
      throw GradingResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    const questionDocument: QuestionDocument =
      await this.questionDocumentRepository.findById(questionScoreReqDto.question_id);
    if (questionDocument == null) {
      throw GradingResponseCodes.INVALID_QUESTION_ID;
    }

    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(questionDocument.assessmentBlockDocument.toString());

    if (assessmentBlockDocument.assessmentDocument.toString() != assessmentDocument.id) {
      throw GradingResponseCodes.INVALID_ASSESSMENT_ID;
    }

    let candidateResponseScoreDocument: CandidateResponseScoreDocument =
      await this.candidateResponseScoreDocumentRepository.getForCandidateAndQuestion(candidateDocument, questionDocument);
    if (candidateResponseScoreDocument != null) {
      candidateResponseScoreDocument.score = questionScoreReqDto.score;
    } else {
      candidateResponseScoreDocument = this.candidateResponseScoreDocumentRepository.getModelInstance();
      candidateResponseScoreDocument.candidateDocument = candidateDocument;
      candidateResponseScoreDocument.questionDocument = questionDocument;
      candidateResponseScoreDocument.assessmentBlockDocument = assessmentBlockDocument;
      candidateResponseScoreDocument.assessmentDocument = assessmentBlockDocument.assessmentDocument;
      candidateResponseScoreDocument.score = questionScoreReqDto.score;
    }
    await this.candidateResponseScoreDocumentRepository.save(candidateResponseScoreDocument);
  }

  async autoScoreAndSaveCandidateResponseScore(
    candidateDocument: CandidateDocument,
    questionDocument: QuestionDocument,
    questionStrategy: IQuestionStrategy,
  ) {

    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(questionDocument.assessmentBlockDocument.toString());

    let candidateResponseScoreDocument: CandidateResponseScoreDocument =
      await this.candidateResponseScoreDocumentRepository.getForCandidateAndQuestion(candidateDocument, questionDocument);
    if (candidateResponseScoreDocument != null) {
      candidateResponseScoreDocument.score = questionStrategy.score();
    } else {
      candidateResponseScoreDocument = this.candidateResponseScoreDocumentRepository.getModelInstance();
      candidateResponseScoreDocument.candidateDocument = candidateDocument;
      candidateResponseScoreDocument.questionDocument = questionDocument;
      candidateResponseScoreDocument.assessmentBlockDocument = assessmentBlockDocument;
      candidateResponseScoreDocument.assessmentDocument = assessmentBlockDocument.assessmentDocument;
      candidateResponseScoreDocument.score = questionStrategy.score();
    }

    await this.candidateResponseScoreDocumentRepository.save(candidateResponseScoreDocument);
  }

  async markCandidateAssessmentGradingComplete(
    candidateId: string,
    assessmentId: string,
  ) {
    const candidateDocument: CandidateDocument = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessmentDocument: AssessmentDocument = await this.getAssessmentByIdOrThrow(
      assessmentId,
    );

    if (assessmentDocument.status != AssessmentStatus.ACTIVE) {
      throw GradingResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    const candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
        candidateDocument,
        assessmentDocument,
      );

    if (!candidateAssessmentDocument) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }
    if (
      candidateAssessmentDocument.status != CandidateAssessmentStatus.GRADING_PENDING
    ) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
    }

    const countOfScoredResponses: number =
      await this.candidateResponseScoreDocumentRepository.getCountForCandidateAndAssessment(
        candidateDocument,
        assessmentDocument,
      );

    const countOfResponses: number = candidateAssessmentDocument.candidateResponseDocuments.length;

    if (countOfScoredResponses != countOfResponses) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_SCORING_PENDING;
    }

    candidateAssessmentDocument.status = CandidateAssessmentStatus.GRADING_COMPLETED;
    candidateAssessmentDocument.end_date = new Date();
    await this.candidateAssessmentDocumentRepository.save(candidateAssessmentDocument);
  }

  async getCandidateAssessmentDecision(
    candidateId: string,
    assessmentId: string,
  ): Promise<AssessmentDecision> {
    const candidateDocument: CandidateDocument = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessmentDocument: AssessmentDocument = await this.getAssessmentByIdOrThrow(
      assessmentId,
    );

    const candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
        candidateDocument,
        assessmentDocument,
      );

    if (!candidateAssessmentDocument) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }

    return candidateAssessmentDocument.assessment_decision;
  }

  async setCandidateAssessmentDecision(
    candidateId: string,
    assessmentId: string,
    decision: string,
  ) {
    const candidateDocument: CandidateDocument = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessmentDocument: AssessmentDocument = await this.getAssessmentByIdOrThrow(
      assessmentId,
    );

    if (assessmentDocument.status != AssessmentStatus.ACTIVE) {
      throw GradingResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    const assessmentDecision: AssessmentDecision =
      AssessmentDecision[decision as keyof typeof AssessmentDecision];

    if (assessmentDecision == null) {
      throw GradingResponseCodes.INVALID_ASSESSMENT_DECISION;
    }

    const candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
        candidateDocument,
        assessmentDocument,
      );

    if (candidateAssessmentDocument == null) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }

    if (candidateAssessmentDocument.status != CandidateAssessmentStatus.GRADING_COMPLETED) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
    }

    candidateAssessmentDocument.assessment_decision = assessmentDecision;

    await this.candidateAssessmentDocumentRepository.save(candidateAssessmentDocument);
  }

  private async getCandidateByIdOrThrow(id: string): Promise<CandidateDocument> {
    const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(id);

    if (candidateDocument == null) {
      throw GradingResponseCodes.INVALID_CANDIDATE_ID;
    }
    return candidateDocument;
  }

  private async getAssessmentByIdOrThrow(id: string): Promise<AssessmentDocument> {
    const assessmentDocument: AssessmentDocument = await this.assessmentDocumentRepository.findById(id);
    if (assessmentDocument == null) {
      throw GradingResponseCodes.INVALID_ASSESSMENT_ID;
    }
    return assessmentDocument;
  }

  private async getAssessmentBlockByIdOrThrow(id: string): Promise<AssessmentBlockDocument> {
    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(id);
    if (assessmentBlockDocument == null) {
      throw GradingResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }
    return assessmentBlockDocument;
  }

  private async getQuestionByIdOrThrow(id: string): Promise<QuestionDocument> {
    const questionDocument: QuestionDocument = await this.questionDocumentRepository.findById(id);
    if (questionDocument == null) {
      throw GradingResponseCodes.INVALID_QUESTION_ID;
    }
    return questionDocument;
  }
}
