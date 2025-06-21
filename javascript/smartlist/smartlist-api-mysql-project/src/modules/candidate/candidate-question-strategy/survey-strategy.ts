import { Injectable } from '@nestjs/common';
import { Question } from 'src/entities/question.entity';
import { SubmitAnswerReqDto } from 'src/modules/candidate/dto/request/submit-answer.req.dto';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class SurveyStrategy extends BaseQuestionStrategy {
  constructor(submitAnswerReqDto: SubmitAnswerReqDto, question: Question) {
    super(submitAnswerReqDto, question);
  }

  score() {
    const answerOptions: number[] = this.submitAnswerReqDto.answer_ids;
    const correctAnswerOptions: number[] = [];
    this.question.answerOptions.forEach((answerOption) => {
      if (answerOption.correct) {
        correctAnswerOptions.push(answerOption.id);
      }
    });
    correctAnswerOptions.sort();
    answerOptions.sort();
    let matchCount = 0;

    for (let i = 0; i < correctAnswerOptions.length; i++) {
      if (answerOptions.indexOf(correctAnswerOptions[i]) != -1) {
        matchCount++;
      }
    }

    return matchCount > 0 ? this.question.score : 0;
  }
}
