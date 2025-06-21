import { Injectable } from '@nestjs/common';
import { QuestionDocumentRepository } from 'src/modules/question/question.document.repository';
import { QuestionDocument } from 'src/schemas/question.schema';
import { SubmitAnswerReqDto } from '../dto/request/submit-answer.req.dto';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class McqMultipleStrategy extends BaseQuestionStrategy {
  constructor(submitAnswerReqDto: SubmitAnswerReqDto,
    questionDocument: QuestionDocument,
    questionDocumentRepository: QuestionDocumentRepository) {
    super(submitAnswerReqDto, questionDocument, questionDocumentRepository);
  }

  score(): number {
    const answerOptions: string[] = this.submitAnswerReqDto.answer_ids;
    const correctAnswerOptions: string[] = [];
    this.questionDocument.answerOptionDocuments.forEach(answerOptionDocument => {
      if (answerOptionDocument.correct) {
        correctAnswerOptions.push(answerOptionDocument._id.toString());
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
      this.questionDocument.score * (matchCount / correctAnswerOptions.length),
    );
  }
}
