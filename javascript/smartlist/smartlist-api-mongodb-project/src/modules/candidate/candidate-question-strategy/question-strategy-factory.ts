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
import { QuestionDocument } from 'src/schemas/question.schema';
import { QuestionDocumentRepository } from 'src/modules/question/question.document.repository';
import { AssetFileDocumentRepository } from 'src/modules/file/file.document.repository';

export function getQuestionStrategy(
  submitAnswerReqDto: SubmitAnswerReqDto,
  questionDocument: QuestionDocument,
  questionDocumentRepository: QuestionDocumentRepository,
  assetFileDocumentRepository: AssetFileDocumentRepository,
): IQuestionStrategy {
  let questionStrategy: IQuestionStrategy;
  switch (questionDocument.type) {
    case QuestionType.SCORED_MCQ_SINGLE:
      questionStrategy = new McqSingleStrategy(submitAnswerReqDto, questionDocument, questionDocumentRepository);
      break;
    case QuestionType.SCORED_MCQ_SINGLE_WEIGHTED_SELECT:
      questionStrategy = new McqSingleWeightedSelectStrategy(submitAnswerReqDto, questionDocument, questionDocumentRepository);
      break;
    case QuestionType.SCORED_MCQ_MULTIPLE:
      questionStrategy = new McqMultipleStrategy(submitAnswerReqDto, questionDocument, questionDocumentRepository);
      break;
    case QuestionType.SURVEY:
      questionStrategy = new SurveyStrategy(submitAnswerReqDto, questionDocument, questionDocumentRepository);
      break;
    case QuestionType.TEXT_RESPONSE:
      questionStrategy = new TextStrategy(submitAnswerReqDto, questionDocument, questionDocumentRepository);
      break;
    case QuestionType.VIDEO_RESPONSE:
      questionStrategy = new VideoStrategy(submitAnswerReqDto, questionDocument, questionDocumentRepository, assetFileDocumentRepository);
      break;
    case QuestionType.FILE_RESPONSE:
      questionStrategy = new FileStrategy(submitAnswerReqDto, questionDocument, questionDocumentRepository, assetFileDocumentRepository);
      break;
    default:
      break;
  }
  return questionStrategy;
}
