import { AnswerOption } from 'src/entities/answer-option.entity';
import { Question } from 'src/entities/question.entity';
import { CandidateResponseCodes } from 'src/modules/candidate/candidate.response.codes';
import { SubmitAnswerReqDto } from 'src/modules/candidate/dto/request/submit-answer.req.dto';
import { AnswerOptionRepository } from 'src/modules/question/answer-option.repository';
import { arrayHasDuplicates } from 'src/utils/app.utils';
import { getCustomRepository } from 'typeorm';
import { IQuestionStrategy } from '../interfaces/interface-question-strategy';

export abstract class BaseQuestionStrategy implements IQuestionStrategy {
  protected answerOptionRepository: AnswerOptionRepository;
  constructor(
    protected submitAnswerReqDto: SubmitAnswerReqDto,
    protected question: Question,
  ) {
    this.answerOptionRepository = getCustomRepository(AnswerOptionRepository);
  }

  async validate() {
    if (arrayHasDuplicates(this.submitAnswerReqDto.answer_ids)) {
      throw CandidateResponseCodes.INVALID_ANSWER_ID;
    }

    if (this.submitAnswerReqDto.answer_ids.length == 0) {
      throw CandidateResponseCodes.INVALID_ANSWER_ID;
    }

    for (let i = 0; i < this.submitAnswerReqDto.answer_ids.length; i++) {
      const answerOption: AnswerOption =
        await this.answerOptionRepository.findByIdWithQuestion(
          this.submitAnswerReqDto.answer_ids[i],
        );

      if (
        answerOption == null ||
        answerOption.question.id != this.question.id
      ) {
        throw CandidateResponseCodes.INVALID_ANSWER_ID;
      }
    }
  }

  abstract score(): number;
}
