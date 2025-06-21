import { Injectable } from '@nestjs/common';
import { SubmitAnswerReqDto } from 'src/modules/candidate/dto/request/submit-answer.req.dto';
import { QuestionDocumentRepository } from 'src/modules/question/question.document.repository';
import { QuestionDocument } from 'src/schemas/question.schema';
import { CandidateResponseCodes } from '../candidate.response.codes';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class McqSingleWeightedSelectStrategy extends BaseQuestionStrategy {
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
    let score = 0;
    this.questionDocument.answerOptionDocuments.forEach(answerOptionDocument => {
      this.submitAnswerReqDto.answer_ids.forEach((id) => {
        if (answerOptionDocument._id.toString() == id) {
          score = answerOptionDocument.score;
        }
      });
    });
    return score;
  }
}
