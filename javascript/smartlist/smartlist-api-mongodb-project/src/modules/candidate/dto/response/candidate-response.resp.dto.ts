import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { CandidateResponse } from 'src/entities/candidate-response.entity';
import { CandidateResponseDocument } from 'src/schemas/candidate-response.schema';

export class CandidateResponseRespDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  question_id: string;

  @ApiProperty({
    type: Array,
  })
  answer_ids: string[];

  @ApiProperty({
    type: String,
  })
  file_id: string;

  @ApiProperty({
    type: String,
  })
  answer_text: string;

  constructor(candidateResponseDocument: CandidateResponseDocument) {
    this.id = candidateResponseDocument.id;
    this.question_id = candidateResponseDocument.questionDocument.toString();
    this.answer_ids =
      !candidateResponseDocument.answers
        ? []
        : candidateResponseDocument.answers.split(',');
    this.file_id =
      candidateResponseDocument.assetFileDocument != null ? candidateResponseDocument.assetFileDocument.toString() : null;
    this.answer_text =
      candidateResponseDocument.answer_text != null ? candidateResponseDocument.answer_text : '';
  }
}
