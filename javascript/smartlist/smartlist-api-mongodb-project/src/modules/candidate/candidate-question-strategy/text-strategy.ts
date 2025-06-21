import { Injectable } from '@nestjs/common';
import { QuestionDocumentRepository } from 'src/modules/question/question.document.repository';
import { QuestionResponseCodes } from 'src/modules/question/question.response.codes';
import { QuestionDocument } from 'src/schemas/question.schema';
import { CandidateResponseCodes } from '../candidate.response.codes';
import { SubmitAnswerReqDto } from '../dto/request/submit-answer.req.dto';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class TextStrategy extends BaseQuestionStrategy {
  constructor(submitAnswerReqDto: SubmitAnswerReqDto,
    questionDocument: QuestionDocument,
    questionDocumentRepository: QuestionDocumentRepository) {
    super(submitAnswerReqDto, questionDocument, questionDocumentRepository);
  }

  async validate() {
    if (!this.submitAnswerReqDto.answer_text) {
      throw CandidateResponseCodes.INVALID_ANSWER_TEXT;
    }
  }

  score(): number {
    return 0;
  }
}
