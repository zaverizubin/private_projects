import { Injectable } from '@nestjs/common';
import { Question } from 'src/entities/question.entity';
import { CandidateResponseCodes } from '../candidate.response.codes';
import { SubmitAnswerReqDto } from '../dto/request/submit-answer.req.dto';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class McqSingleStrategy extends BaseQuestionStrategy {
  constructor(submitAnswerReqDto: SubmitAnswerReqDto, question: Question) {
    super(submitAnswerReqDto, question);
  }
  async validate() {
    await super.validate();
    if (this.submitAnswerReqDto.answer_ids.length > 1) {
      throw CandidateResponseCodes.INVALID_ANSWER_ID;
    }
  }

  score(): number {
    const answerId: number = this.submitAnswerReqDto.answer_ids[0];
    let score = 0;
    this.question.answerOptions.forEach((answerOption) => {
      if (answerOption.correct && answerOption.id == answerId) {
        score = this.question.score;
      }
    });

    return score;
  }
}
