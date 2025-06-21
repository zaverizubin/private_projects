import { QuestionType } from 'src/enums/question.type';
import { IQuestionStrategy } from '../question-interface/question-interface';
import { QuestionReqDto } from '../dto/request/question.req.dto';
import { QuestionResponseCodes } from '../question.response.codes';
import { FileStrategy } from './file.strategy';
import { McqMultipleStrategy } from './mcq-multiple-strategy';
import { McqSingleStrategy } from './mcq-single-strategy';
import { McqSingleWeightedStrategy } from './mcq-single-weighted-strategy';
import { SurveyStrategy } from './survey-strategy';
import { TextStrategy } from './text-strategy';
import { VideoStrategy } from './video-strategy';

export function getQuestionStrategy(
  questionReqDto: QuestionReqDto,
): IQuestionStrategy {
  let questionStrategy: IQuestionStrategy;
  switch (questionReqDto.type) {
    case QuestionType.SCORED_MCQ_SINGLE:
      questionStrategy = new McqSingleStrategy(questionReqDto);
      break;
    case QuestionType.SCORED_MCQ_SINGLE_WEIGHTED_SELECT:
      questionStrategy = new McqSingleWeightedStrategy(questionReqDto);
      break;
    case QuestionType.SCORED_MCQ_MULTIPLE:
      questionStrategy = new McqMultipleStrategy(questionReqDto);
      break;
    case QuestionType.SURVEY:
      questionStrategy = new SurveyStrategy(questionReqDto);
      break;
    case QuestionType.TEXT_RESPONSE:
      questionStrategy = new TextStrategy(questionReqDto);
      break;
    case QuestionType.VIDEO_RESPONSE:
      questionStrategy = new VideoStrategy(questionReqDto);
      break;
    case QuestionType.FILE_RESPONSE:
      questionStrategy = new FileStrategy(questionReqDto);
      break;
    default:
      throw QuestionResponseCodes.INVALID_QUESTION_TYPE;
  }
  return questionStrategy;
}
