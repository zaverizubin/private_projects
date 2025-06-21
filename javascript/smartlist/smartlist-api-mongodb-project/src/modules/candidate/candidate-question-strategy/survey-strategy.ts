import { Injectable } from '@nestjs/common';
import { SubmitAnswerReqDto } from 'src/modules/candidate/dto/request/submit-answer.req.dto';
import { QuestionDocumentRepository } from 'src/modules/question/question.document.repository';
import { QuestionDocument } from 'src/schemas/question.schema';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class SurveyStrategy extends BaseQuestionStrategy {
  constructor(submitAnswerReqDto: SubmitAnswerReqDto,
    questionDocument: QuestionDocument,
    questionDocumentRepository: QuestionDocumentRepository) {
    super(submitAnswerReqDto, questionDocument, questionDocumentRepository);
  }

  score() {
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

    return matchCount > 0 ? this.questionDocument.score : 0;
  }
}
