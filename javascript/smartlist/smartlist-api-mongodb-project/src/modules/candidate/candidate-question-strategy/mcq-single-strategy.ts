import { Injectable } from '@nestjs/common';
import { QuestionDocumentRepository } from 'src/modules/question/question.document.repository';
import { QuestionDocument } from 'src/schemas/question.schema';
import { CandidateResponseCodes } from '../candidate.response.codes';
import { SubmitAnswerReqDto } from '../dto/request/submit-answer.req.dto';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class McqSingleStrategy extends BaseQuestionStrategy {
  constructor(submitAnswerReqDto: SubmitAnswerReqDto,
    questionDocument: QuestionDocument,
    questionDocumentRepository: QuestionDocumentRepository) {
    super(submitAnswerReqDto, questionDocument, questionDocumentRepository);
  }
  async validate() {
    await super.validate();
    if (this.submitAnswerReqDto.answer_ids.length > 1) {
      throw CandidateResponseCodes.INVALID_ANSWER_ID;
    }
  }

  score(): number {
    const answerId: string = this.submitAnswerReqDto.answer_ids[0];
    let score = 0;
    this.questionDocument.answerOptionDocuments.forEach((answerOption) => {
      if (answerOption.correct && answerOption._id.toString() == answerId) {
        score = this.questionDocument.score;
      }
    });

    return score;
  }
}
