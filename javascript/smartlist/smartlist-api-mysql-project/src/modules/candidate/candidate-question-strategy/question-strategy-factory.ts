import { Question } from 'src/entities/question.entity';
import { QuestionType } from 'src/enums/question.type';
import { SubmitAnswerReqDto } from '../dto/request/submit-answer.req.dto';
import { McqMultipleStrategy } from './mcq-multiple-strategy';
import { McqSingleWeightedSelectStrategy } from './mcq-single-weighted-select-strategy';
import { McqSingleStrategy } from './mcq-single-strategy';
import { SurveyStrategy } from './survey-strategy';
import { VideoStrategy } from './video-strategy';
import { TextStrategy } from './text-strategy';
import { IQuestionStrategy } from '../interfaces/interface-question-strategy';
import { FileStrategy } from './file-strategy';

export function getQuestionStrategy(
  submitAnswerReqDto: SubmitAnswerReqDto,
  question: Question,
): IQuestionStrategy {
  let questionStrategy: IQuestionStrategy;
  switch (question.type) {
    case QuestionType.SCORED_MCQ_SINGLE:
      questionStrategy = new McqSingleStrategy(submitAnswerReqDto, question);
      break;
    case QuestionType.SCORED_MCQ_SINGLE_WEIGHTED_SELECT:
      questionStrategy = new McqSingleWeightedSelectStrategy(
        submitAnswerReqDto,
        question,
      );
      break;
    case QuestionType.SCORED_MCQ_MULTIPLE:
      questionStrategy = new McqMultipleStrategy(submitAnswerReqDto, question);
      break;
    case QuestionType.SURVEY:
      questionStrategy = new SurveyStrategy(submitAnswerReqDto, question);
      break;
    case QuestionType.TEXT_RESPONSE:
      questionStrategy = new TextStrategy(submitAnswerReqDto, question);
      break;
    case QuestionType.VIDEO_RESPONSE:
      questionStrategy = new VideoStrategy(submitAnswerReqDto, question);
      break;
    case QuestionType.FILE_RESPONSE:
      questionStrategy = new FileStrategy(submitAnswerReqDto, question);
      break;
    default:
      break;
  }
  return questionStrategy;
}
