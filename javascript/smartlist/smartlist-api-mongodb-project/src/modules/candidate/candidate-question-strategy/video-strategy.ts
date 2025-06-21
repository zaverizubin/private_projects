import { Injectable } from '@nestjs/common';
import { CandidateResponseCodes } from 'src/modules/candidate/candidate.response.codes';
import { SubmitAnswerReqDto } from 'src/modules/candidate/dto/request/submit-answer.req.dto';
import { AssetFileDocumentRepository } from 'src/modules/file/file.document.repository';
import { QuestionDocumentRepository } from 'src/modules/question/question.document.repository';
import { AssetFileDocument } from 'src/schemas/asset-file.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { REGEX } from 'src/utils/file.utils';
import { getCustomRepository } from 'typeorm';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class VideoStrategy extends BaseQuestionStrategy {
  private assetFileDocumentRepository: AssetFileDocumentRepository;

  constructor(submitAnswerReqDto: SubmitAnswerReqDto,
    question: QuestionDocument,
    questionDocumentRepository: QuestionDocumentRepository,
    assetFileDocumentRepository: AssetFileDocumentRepository) {
    super(submitAnswerReqDto, question, questionDocumentRepository);
    this.assetFileDocumentRepository = assetFileDocumentRepository;
  }

  async validate() {
    let assetFileDocument: AssetFileDocument = null;
    if (this.submitAnswerReqDto.file_id == null) {
      throw CandidateResponseCodes.INVALID_VIDEO_FILE_ID;
    }

    assetFileDocument = await this.assetFileDocumentRepository.findById(this.submitAnswerReqDto.file_id);
    if (assetFileDocument == null) {
      throw CandidateResponseCodes.INVALID_VIDEO_FILE_ID;
    }
    if (!assetFileDocument.mime_type.match(REGEX.ALLOWED_VIDEO_FILE_EXTENSIONS)) {
      throw CandidateResponseCodes.INVALID_VIDEO_FILE_ID;
    }
  }

  score(): number {
    return 0;
  }
}
