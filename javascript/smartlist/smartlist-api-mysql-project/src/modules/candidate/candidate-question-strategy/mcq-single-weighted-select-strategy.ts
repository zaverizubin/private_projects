import { Injectable } from '@nestjs/common';
import { Question } from 'src/entities/question.entity';
import { SubmitAnswerReqDto } from 'src/modules/candidate/dto/request/submit-answer.req.dto';
import { CandidateResponseCodes } from '../candidate.response.codes';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class McqSingleWeightedSelectStrategy extends BaseQuestionStrategy {
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
    let score = 0;
    this.question.answerOptions.forEach((answerOption) => {
      this.submitAnswerReqDto.answer_ids.forEach((id) => {
        if (answerOption.id == id) {
          score = answerOption.score;
        }
      });
    });
    return score;
  }
}
