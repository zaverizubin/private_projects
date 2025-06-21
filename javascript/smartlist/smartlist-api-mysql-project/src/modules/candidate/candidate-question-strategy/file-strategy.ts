import { Injectable } from '@nestjs/common';
import { AssetFile } from 'src/entities/asset-file.entity';
import { Question } from 'src/entities/question.entity';
import { CandidateResponseCodes } from 'src/modules/candidate/candidate.response.codes';
import { SubmitAnswerReqDto } from 'src/modules/candidate/dto/request/submit-answer.req.dto';
import { FileRepository } from 'src/modules/file/file.repository';
import { QuestionResponseCodes } from 'src/modules/question/question.response.codes';
import { REGEX } from 'src/utils/file.utils';
import { getCustomRepository } from 'typeorm';
import { BaseQuestionStrategy } from './base-question-strategy';

@Injectable()
export class FileStrategy extends BaseQuestionStrategy {
  private fileRepository: FileRepository;

  constructor(submitAnswerReqDto: SubmitAnswerReqDto, question: Question) {
    super(submitAnswerReqDto, question);
    this.fileRepository = getCustomRepository(FileRepository);
  }

  async validate() {
    if (this.question.options.file_required) {
      let file: AssetFile = null;
      if (this.submitAnswerReqDto.file_id == null) {
        throw CandidateResponseCodes.INVALID_FILE_ID;
      }

      file = await this.fileRepository.findOne(this.submitAnswerReqDto.file_id);
      if (file == null) {
        throw CandidateResponseCodes.INVALID_FILE_ID;
      }
      if (!file.mimetype.match(REGEX.ALLOWED_FILE_EXTENSIONS)) {
        throw CandidateResponseCodes.INVALID_FILE_ID;
      }
    }
    if (
      this.question.options.text_required &&
      !this.submitAnswerReqDto.answer_text
    ) {
      throw QuestionResponseCodes.INVALID_ANSWER_OPTION;
    }
  }

  score(): number {
    return 0;
  }
}
