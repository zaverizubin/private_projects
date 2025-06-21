import { CandidateResponseCodes } from 'src/modules/candidate/candidate.response.codes';
import { SubmitAnswerReqDto } from 'src/modules/candidate/dto/request/submit-answer.req.dto';
import { QuestionDocumentRepository } from 'src/modules/question/question.document.repository';
import { AnswerOptionDocument } from 'src/schemas/answer-option.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { arrayHasDuplicates } from 'src/utils/app.utils';
import { IQuestionStrategy } from '../interfaces/interface-question-strategy';

export abstract class BaseQuestionStrategy implements IQuestionStrategy {

  constructor(
    protected submitAnswerReqDto: SubmitAnswerReqDto,
    protected questionDocument: QuestionDocument,
    protected questionDocumentRepository: QuestionDocumentRepository,
  ) {

  }

  async validate() {
    if (arrayHasDuplicates(this.submitAnswerReqDto.answer_ids)) {
      throw CandidateResponseCodes.INVALID_ANSWER_ID;
    }

    if (this.submitAnswerReqDto.answer_ids.length == 0) {
      throw CandidateResponseCodes.INVALID_ANSWER_ID;
    }

    for (let i = 0; i < this.submitAnswerReqDto.answer_ids.length; i++) {
      const answerOptionDocument: AnswerOptionDocument =
        this.questionDocumentRepository.findAnswerOptionById(
          this.questionDocument, this.submitAnswerReqDto.answer_ids[i],
        );
      if (answerOptionDocument == null) {
        throw CandidateResponseCodes.INVALID_ANSWER_ID;
      }
    }
  }

  abstract score(): number;
}
