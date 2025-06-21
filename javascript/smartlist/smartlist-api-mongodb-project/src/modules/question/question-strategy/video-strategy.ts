import { IQuestionStrategy } from '../question-interface/question-interface';
import { QuestionReqDto } from '../dto/request/question.req.dto';
import { QuestionResponseCodes } from '../question.response.codes';

export class VideoStrategy implements IQuestionStrategy {
  constructor(protected questionReqDto: QuestionReqDto) {}
  validate() {
    if (this.questionReqDto.answer_options.length > 0) {
      throw QuestionResponseCodes.INVALID_ANSWER_OPTIONS_FOR_QUESTION_TYPE;
    }
  }
}
