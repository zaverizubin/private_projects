import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AnswerOption } from 'src/entities/answer-option.entity';
import { AssessmentBlock } from 'src/entities/assessment-block.entity';
import { Assessment } from 'src/entities/assessment.entity';
import { Question } from 'src/entities/question.entity';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { QuestionType } from 'src/enums/question.type';
import { AssessmentBlockRepository } from '../assessment-block/assessment-block.repository';
import { AnswerOptionRepository } from './answer-option.repository';
import { QuestionReqDto } from './dto/request/question.req.dto';
import { ReorderReqDto } from './dto/request/reorder.req.dto';
import { QuestionRespDto } from './dto/response/question.resp.dto';
import { IQuestionStrategy } from './question-interface/question-interface';
import { getQuestionStrategy } from './question-strategy/question-strategy-factory';
import { QuestionRepository } from './question.repository';
import { QuestionResponseCodes } from './question.response.codes';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(AssessmentBlockRepository)
    private assessmentBlockRepository: AssessmentBlockRepository,
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
    @InjectRepository(AnswerOptionRepository)
    private answerOptionRepository: AnswerOptionRepository,
  ) {}
  async getAllByAssessmentBlockId(
    assessmentBlockId: number,
    forAssessment: boolean,
  ): Promise<QuestionRespDto[]> {
    const assessmentBlock: AssessmentBlock =
      await this.assessmentBlockRepository.findByIdWithAssessment(
        assessmentBlockId,
      );
    this.throwIfAssessmentBlockNotDefined(assessmentBlock);

    const questions: Question[] =
      await this.questionRepository.findAllByAssessmentBlockWithAnswers(
        assessmentBlock,
      );

    const questionRespDtos: QuestionRespDto[] = [];

    questions.forEach((question: Question) => {
      questionRespDtos.push(new QuestionRespDto(question, forAssessment));
    });
    return questionRespDtos;
  }

  async getQuestionById(
    questionId: number,
    forAssessment: boolean,
  ): Promise<QuestionRespDto> {
    const question: Question =
      await this.questionRepository.findByIdWithAnswerOptions(questionId);

    this.throwIfQuestionNotDefined(question);

    const questionRespDto: QuestionRespDto = new QuestionRespDto(
      question,
      forAssessment,
    );
    return questionRespDto;
  }

  async createQuestion(
    assessmentBlockId: number,
    questionReqDto: QuestionReqDto,
  ): Promise<number> {
    const assessmentBlock: AssessmentBlock =
      await this.assessmentBlockRepository.findByIdWithAssessment(
        assessmentBlockId,
      );

    this.throwIfAssessmentBlockNotDefined(assessmentBlock);
    this.throwIfAssessmentNotEditable(assessmentBlock.assessment);

    const questionStrategy: IQuestionStrategy =
      getQuestionStrategy(questionReqDto);
    questionStrategy.validate();

    let sortOrder: number = await this.questionRepository.getMaxSortOrder(
      assessmentBlockId,
    );
    sortOrder = sortOrder != null ? sortOrder + 1 : 1;

    let question: Question = this.getEntityFromQuestionReqDto(questionReqDto);
    question.assessmentBlock = assessmentBlock;
    question.sortOrder = sortOrder;
    question = await this.questionRepository.save(question);
    return question.id;
  }

  async updateQuestion(questionId: number, questionReqDto: QuestionReqDto) {
    let question = await this.questionRepository.findByIdWithRelations(
      questionId,
    );
    this.throwIfQuestionNotDefined(question);
    this.throwIfAssessmentNotEditable(question.assessmentBlock.assessment);

    const questionStrategy: IQuestionStrategy =
      getQuestionStrategy(questionReqDto);
    questionStrategy.validate();

    await this.answerOptionRepository.remove(question.answerOptions);

    question = this.getEntityFromQuestionReqDto(questionReqDto);
    question.id = questionId;
    question.assessmentBlock = question.assessmentBlock;
    await this.questionRepository.save(question);
  }

  async reorderQuestions(
    assessmentBlockId: number,
    reorderReqDto: ReorderReqDto,
  ) {
    const assessmentBlock: AssessmentBlock =
      await this.assessmentBlockRepository.findByIdWithAssessment(
        assessmentBlockId,
      );
    this.throwIfAssessmentBlockNotDefined(assessmentBlock);
    this.throwIfAssessmentNotEditable(assessmentBlock.assessment);

    if (reorderReqDto.ids.length == 0) {
      throw QuestionResponseCodes.INVALID_QUESTION_ID_LIST;
    }

    const questions: Question[] =
      await this.questionRepository.findAllByAssessmentBlock(assessmentBlock);
    if (questions.length != reorderReqDto.ids.length) {
      throw QuestionResponseCodes.INVALID_QUESTION_ID_LIST;
    }

    questions.forEach((ab) => {
      if (reorderReqDto.ids.indexOf(ab.id) == -1) {
        throw QuestionResponseCodes.INVALID_QUESTION_ID_LIST;
      }
    });

    reorderReqDto.ids.forEach((id, index) => {
      const question: Question = questions.find((ab) => ab.id == id);
      if (question != null) {
        question.sortOrder = index + 1;
      }
    });

    await this.questionRepository.save(questions);
  }

  async deleteQuestion(questionId: number) {
    const question = await this.questionRepository.findByIdWithRelations(
      questionId,
    );

    this.throwIfQuestionNotDefined(question);
    this.throwIfAssessmentNotEditable(question.assessmentBlock.assessment);

    await this.questionRepository.remove(question);
    await this.questionRepository.updateSortOrder(
      question.sortOrder,
      question.assessmentBlock.id,
    );
  }

  private throwIfAssessmentBlockNotDefined(assessmentBlock: AssessmentBlock) {
    if (assessmentBlock == null) {
      throw QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }
  }

  private throwIfAssessmentNotEditable(assessment: Assessment) {
    if (assessment.status != AssessmentStatus.DRAFT) {
      throw QuestionResponseCodes.ASSESSMENT_ACTION_DENIED;
    }
  }

  private throwIfQuestionNotDefined(question: Question) {
    if (!question) {
      throw QuestionResponseCodes.INVALID_QUESTION_ID;
    }
  }

  private getEntityFromQuestionReqDto(
    questionReqDto: QuestionReqDto,
  ): Question {
    const question = new Question();
    question.type = questionReqDto.type as QuestionType;

    question.options = questionReqDto.options;
    question.text = questionReqDto.text;
    question.score = questionReqDto.score;
    question.answerOptions = [];
    questionReqDto.answer_options.forEach((answerOptionDto) => {
      const answerOption = new AnswerOption();
      answerOption.correct = answerOptionDto.correct;
      answerOption.text = answerOptionDto.text;
      answerOption.question = question;
      answerOption.score = answerOptionDto.score;
      question.answerOptions.push(answerOption);
    });
    return question;
  }
}
