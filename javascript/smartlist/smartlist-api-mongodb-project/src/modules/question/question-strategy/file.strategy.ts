import { QuestionReqDto } from '../dto/request/question.req.dto';
import { IQuestionStrategy } from '../question-interface/question-interface';
import { QuestionResponseCodes } from '../question.response.codes';

export class FileStrategy implements IQuestionStrategy {
  constructor(protected questionReqDto: QuestionReqDto) {}
  validate() {
    if (this.questionReqDto.options == null) {
      throw QuestionResponseCodes.INVALID_QUESTION_OPTION;
    }
    if (this.questionReqDto.answer_options.length > 0) {
      throw QuestionResponseCodes.INVALID_ANSWER_OPTIONS_FOR_QUESTION_TYPE;
    }

    if (
      !this.questionReqDto.options.file_required &&
      !this.questionReqDto.options.text_required
    ) {
      throw QuestionResponseCodes.INVALID_QUESTION_OPTION;
    }
  }
}
