import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { CandidateResponse } from 'src/entities/candidate-response.entity';

export class CandidateResponseRespDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  question_id: number;

  @ApiProperty({
    type: Array,
  })
  @ValidateIf((a) => a.answer_ids != null)
  @IsNumber({}, { each: true })
  answer_ids: string[];

  @ApiProperty({
    type: Number,
  })
  @ValidateIf((a) => a.file_id != null)
  @IsInt()
  file_id: number;

  @ApiProperty({
    type: String,
  })
  @IsInt()
  answer_text: string;

  constructor(candidateResponse: CandidateResponse) {
    this.id = candidateResponse.id;
    this.question_id = candidateResponse.question.id;
    this.answer_ids =
      candidateResponse.answers != null
        ? candidateResponse.answers.split(',')
        : [];
    this.file_id =
      candidateResponse.file != null ? candidateResponse.file.id : null;
    this.answer_text =
      candidateResponse.answerText != null ? candidateResponse.answerText : '';
  }
}
