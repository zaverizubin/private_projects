import { Injectable } from '@nestjs/common';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { QuestionType } from 'src/enums/question.type';
import { AnswerOptionDocument } from 'src/schemas/answer-option.schema';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { QuestionReqDto } from './dto/request/question.req.dto';
import { ReorderReqDto } from './dto/request/reorder.req.dto';
import { QuestionRespDto } from './dto/response/question.resp.dto';
import { IQuestionStrategy } from './question-interface/question-interface';
import { getQuestionStrategy } from './question-strategy/question-strategy-factory';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { AnswerOptionDocumentRepository } from './answer-option.document.repository';
import { QuestionDocumentRepository } from './question.document.repository';
import { QuestionResponseCodes } from './question.response.codes';
import { QuestionOptionReqDto } from './dto/request/options.req.dto';
import { CandidateAssessmentDocumentRepository } from '../candidate/candidate-assessment.document.repository';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { CandidateDocumentRepository } from '../candidate/candidate.document.repository';
import { CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';

@Injectable()
export class QuestionService {
  constructor(
    private assessmentDocumentRepository: AssessmentDocumentRepository,
    private assessmentBlockDocumentRepository: AssessmentBlockDocumentRepository,
    private questionDocumentRepository: QuestionDocumentRepository,
    private answerOptionDocumentRepository: AnswerOptionDocumentRepository,
    private candidateDocumentRepository: CandidateDocumentRepository,
    private candidateAssessmentDocumentRepository: CandidateAssessmentDocumentRepository,
  ) { }
  async getAllByAssessmentBlockId(
    assessmentBlockId: string,
    forAssessment: boolean,
    candidateId: string,
  ): Promise<QuestionRespDto[]> {
    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);
    this.throwIfAssessmentBlockNotDefined(assessmentBlockDocument);

    let candidateDocument: CandidateDocument;
    if (candidateId != null) {
      candidateDocument = await this.candidateDocumentRepository.findById(candidateId);
      this.throwIfCandidateNotDefined(candidateDocument);
    }

    let questionDocuments: QuestionDocument[];
    questionDocuments =
      await this.questionDocumentRepository.findAllForAssessmentBlock(
        assessmentBlockDocument,
      );
    if (assessmentBlockDocument.shuffle_questions && forAssessment) {
      questionDocuments = questionDocuments.slice(
        0,
        Math.min(
          assessmentBlockDocument.random_questions,
          questionDocuments.length,
        ),
      );
    } else {
      if (candidateDocument != null) {
        const candidateAssessmentDocument: CandidateAssessmentDocument = await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
          candidateDocument,
          assessmentBlockDocument.assessmentDocument,
        );

        questionDocuments = questionDocuments.filter(questionDocument => {
          if (candidateAssessmentDocument.candidateResponseDocuments.some(crd => crd.questionDocument.toString() == questionDocument.id)) {
            return questionDocument;
          }
        });
      }
    }

    const questionRespDtos: QuestionRespDto[] = [];

    questionDocuments.forEach((questionDocument: QuestionDocument) => {
      questionRespDtos.push(
        new QuestionRespDto(questionDocument, forAssessment),
      );
    });
    return questionRespDtos;
  }

  async getQuestionById(
    questionId: string,
    forAssessment: boolean,
  ): Promise<QuestionRespDto> {
    const questionDocument: QuestionDocument =
      await this.questionDocumentRepository.findById(questionId);

    this.throwIfQuestionNotDefined(questionDocument);

    const questionRespDto: QuestionRespDto = new QuestionRespDto(
      questionDocument,
      forAssessment,
    );
    return questionRespDto;
  }

  async createQuestion(
    assessmentBlockId: string,
    questionReqDto: QuestionReqDto,
  ): Promise<string> {
    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);

    this.throwIfAssessmentBlockNotDefined(assessmentBlockDocument);

    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(
        assessmentBlockDocument.assessmentDocument.toString(),
      );

    this.throwIfAssessmentNotEditable(assessmentDocument);

    const questionStrategy: IQuestionStrategy =
      getQuestionStrategy(questionReqDto);
    questionStrategy.validate();

    let sortOrder: number =
      await this.questionDocumentRepository.getMaxSortOrder(
        assessmentBlockDocument,
      );
    sortOrder = sortOrder != null ? sortOrder + 1 : 1;

    if (
      assessmentBlockDocument.shuffle_questions &&
      questionReqDto.type == QuestionType.SCORED_MCQ_SINGLE_WEIGHTED_SELECT
    ) {
      if (questionReqDto.score > assessmentBlockDocument.question_point) {
        throw QuestionResponseCodes.INVALID_SCORE;
      }
      questionReqDto.score = assessmentBlockDocument.question_point;
    }

    let questionDocument: QuestionDocument = this.getEntityFromQuestionReqDto(
      this.questionDocumentRepository.getModelInstance(),
      questionReqDto,
    );
    questionDocument.assessmentBlockDocument = assessmentBlockDocument;
    questionDocument.sort_order = sortOrder;
    questionDocument = await this.questionDocumentRepository.save(
      questionDocument,
    );
    return questionDocument.id;
  }

  async updateQuestion(questionId: string, questionReqDto: QuestionReqDto) {
    let questionDocument: QuestionDocument =
      await this.questionDocumentRepository.findById(questionId);
    this.throwIfQuestionNotDefined(questionDocument);

    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(
        questionDocument.assessmentBlockDocument.toString(),
      );
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(
        assessmentBlockDocument.assessmentDocument.toString(),
      );

    this.throwIfAssessmentNotEditable(assessmentDocument);

    const questionStrategy: IQuestionStrategy =
      getQuestionStrategy(questionReqDto);
    questionStrategy.validate();

    if (questionDocument.assessmentBlockDocument.shuffle_questions) {
      questionReqDto.score =
        questionDocument.assessmentBlockDocument.question_point;
    }

    questionDocument = this.getEntityFromQuestionReqDto(
      questionDocument,
      questionReqDto,
    );
    questionDocument.isNew = false;
    await this.questionDocumentRepository.save(questionDocument);
  }

  async reorderQuestions(
    assessmentBlockId: string,
    reorderReqDto: ReorderReqDto,
  ) {
    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);
    this.throwIfAssessmentBlockNotDefined(assessmentBlockDocument);

    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(
        assessmentBlockDocument.assessmentDocument.toString(),
      );
    this.throwIfAssessmentNotEditable(assessmentDocument);

    if (reorderReqDto.ids.length == 0) {
      throw QuestionResponseCodes.INVALID_QUESTION_ID_LIST;
    }

    const questionDocuments: QuestionDocument[] =
      await this.questionDocumentRepository.findAllForAssessmentBlock(
        assessmentBlockDocument,
      );
    if (questionDocuments.length != reorderReqDto.ids.length) {
      throw QuestionResponseCodes.INVALID_QUESTION_ID_LIST;
    }

    questionDocuments.forEach((ab) => {
      if (reorderReqDto.ids.indexOf(ab.id) == -1) {
        throw QuestionResponseCodes.INVALID_QUESTION_ID_LIST;
      }
    });

    reorderReqDto.ids.forEach((id, index) => {
      const questionDocument: QuestionDocument = questionDocuments.find(
        (ab) => ab.id == id,
      );
      if (questionDocument != null) {
        questionDocument.sort_order = index + 1;
      }
    });

    await this.questionDocumentRepository.saveAll(questionDocuments);
  }

  async deleteQuestion(questionId: string) {
    const questionDocument: QuestionDocument =
      await this.questionDocumentRepository.findById(questionId);
    this.throwIfQuestionNotDefined(questionDocument);

    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(
        questionDocument.assessmentBlockDocument.toString(),
      );

    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(
        assessmentBlockDocument.assessmentDocument.toString(),
      );

    this.throwIfAssessmentNotEditable(assessmentDocument);

    await this.questionDocumentRepository.delete(questionDocument);
    await this.questionDocumentRepository.updateSortOrder(
      questionDocument.sort_order,
      questionDocument.assessmentBlockDocument,
    );
  }

  private throwIfAssessmentBlockNotDefined(
    assessmentBlockDocument: AssessmentBlockDocument,
  ) {
    if (assessmentBlockDocument == null) {
      throw QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }
  }

  private throwIfCandidateNotDefined(
    candidateDocument: CandidateDocument,
  ) {
    if (candidateDocument == null) {
      throw QuestionResponseCodes.INVALID_CANDIDATE_ID;
    }
  }

  private throwIfAssessmentNotEditable(assessmentDocument: AssessmentDocument) {
    if (assessmentDocument.status != AssessmentStatus.DRAFT) {
      throw QuestionResponseCodes.ASSESSMENT_ACTION_DENIED;
    }
  }

  private throwIfQuestionNotDefined(questionDocument: QuestionDocument) {
    if (!questionDocument) {
      throw QuestionResponseCodes.INVALID_QUESTION_ID;
    }
  }

  private getEntityFromQuestionReqDto(
    questionDocument: QuestionDocument,
    questionReqDto: QuestionReqDto,
  ): QuestionDocument {
    questionDocument.type = questionReqDto.type as QuestionType;
    questionDocument.options = new QuestionOptionReqDto();
    questionDocument.options.file_required = questionReqDto.options.file_required;
    questionDocument.options.text_required = questionReqDto.options.text_required;
    questionDocument.text = questionReqDto.text;
    questionDocument.score = questionReqDto.score;
    questionDocument.shuffle_options = questionReqDto.shuffle_options;
    questionDocument.answerOptionDocuments = [];
    questionReqDto.answer_options.forEach((answerOptionDto) => {
      const answerOptionDocument: AnswerOptionDocument =
        this.answerOptionDocumentRepository.getModelInstance();
      answerOptionDocument.correct = answerOptionDto.correct;
      answerOptionDocument.text = answerOptionDto.text;
      answerOptionDocument.score = answerOptionDto.score;
      questionDocument.answerOptionDocuments.push(answerOptionDocument);
    });
    return questionDocument;
  }
}
