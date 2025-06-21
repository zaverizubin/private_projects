import { Injectable } from '@nestjs/common';
import { Question } from 'src/entities/question.entity';
import { QuestionResponseCodes } from 'src/modules/question/question.response.codes';
import { SubmitAnswerReqDto } from '../dto/request/submit-answer.req.dto';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class TextStrategy extends BaseQuestionStrategy {
  constructor(submitAnswerReqDto: SubmitAnswerReqDto, question: Question) {
    super(submitAnswerReqDto, question);
  }

  async validate() {
    if (!this.submitAnswerReqDto.answer_text) {
      throw QuestionResponseCodes.INVALID_ANSWER_OPTION;
    }
  }

  score(): number {
    return 0;
  }
}
