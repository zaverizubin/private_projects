import { Injectable } from '@nestjs/common';
import { Question } from 'src/entities/question.entity';
import { SubmitAnswerReqDto } from '../dto/request/submit-answer.req.dto';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class McqMultipleStrategy extends BaseQuestionStrategy {
  constructor(submitAnswerReqDto: SubmitAnswerReqDto, question: Question) {
    super(submitAnswerReqDto, question);
  }

  score(): number {
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

    return Math.floor(
      this.question.score * (matchCount / correctAnswerOptions.length),
    );
  }
}
