import { IQuestionStrategy } from '../question-interface/question-interface';
import { QuestionReqDto } from '../dto/request/question.req.dto';
import { QuestionResponseCodes } from '../question.response.codes';

export class McqSingleWeightedStrategy implements IQuestionStrategy {
  constructor(protected questionReqDto: QuestionReqDto) {}
  validate() {
    if (this.questionReqDto.answer_options.length < 2) {
      throw QuestionResponseCodes.INVALID_ANSWER_OPTIONS_FOR_QUESTION_TYPE;
    }

    let correctCount = 0;
    this.questionReqDto.answer_options.forEach((ao) => {
      correctCount += ao.correct ? 1 : 0;
    });
    if (correctCount != this.questionReqDto.answer_options.length) {
      throw QuestionResponseCodes.INVALID_ANSWER_OPTION;
    }

    this.questionReqDto.answer_options.forEach((answerOptionDto) => {
      if (answerOptionDto.score == null || answerOptionDto.score < 0) {
        throw QuestionResponseCodes.INVALID_SCORE;
      }
    });

    let maxScore = 0;
    this.questionReqDto.answer_options.forEach((answerOptionDto) => {
      if (Number(answerOptionDto.score) > maxScore) {
        maxScore = Number(answerOptionDto.score);
      }
    });
    this.questionReqDto.score = maxScore;
  }
}
