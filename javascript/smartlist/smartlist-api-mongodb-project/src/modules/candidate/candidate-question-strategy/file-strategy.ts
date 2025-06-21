import { Injectable } from '@nestjs/common';
import { CandidateResponseCodes } from 'src/modules/candidate/candidate.response.codes';
import { SubmitAnswerReqDto } from 'src/modules/candidate/dto/request/submit-answer.req.dto';
import { AssetFileDocumentRepository } from 'src/modules/file/file.document.repository';
import { QuestionDocumentRepository } from 'src/modules/question/question.document.repository';
import { QuestionResponseCodes } from 'src/modules/question/question.response.codes';
import { AssetFileDocument } from 'src/schemas/asset-file.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { REGEX } from 'src/utils/file.utils';
import { getCustomRepository } from 'typeorm';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class FileStrategy extends BaseQuestionStrategy {
  private assetFileDocumentRepository: AssetFileDocumentRepository;

  constructor(submitAnswerReqDto: SubmitAnswerReqDto,
    questionDocument: QuestionDocument,
    questionDocumentRepository: QuestionDocumentRepository,
    assetFileDocumentRepository: AssetFileDocumentRepository) {
    super(submitAnswerReqDto, questionDocument, questionDocumentRepository);

    this.assetFileDocumentRepository = assetFileDocumentRepository;
  }

  async validate() {
    if (this.questionDocument.options.file_required) {
      let assetFileDocument: AssetFileDocument = null;
      if (this.submitAnswerReqDto.file_id == null) {
        throw CandidateResponseCodes.INVALID_FILE_ID;
      }

      assetFileDocument = await this.assetFileDocumentRepository.findById(this.submitAnswerReqDto.file_id);
      if (assetFileDocument == null) {
        throw CandidateResponseCodes.INVALID_FILE_ID;
      }
      if (!assetFileDocument.mime_type.match(REGEX.ALLOWED_FILE_EXTENSIONS)) {
        throw CandidateResponseCodes.INVALID_FILE_TYPE;
      }
    }
    if (
      this.questionDocument.options.text_required &&
      !this.submitAnswerReqDto.answer_text
    ) {
      throw QuestionResponseCodes.INVALID_ANSWER_OPTION;
    }
  }

  score(): number {
    return 0;
  }
}
