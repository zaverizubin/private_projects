import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { AnswerOption } from 'src/entities/answer-option.entity';
import { AnswerOptionDocument } from 'src/schemas/answer-option.schema';

export class AnswerOptionRespDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    type: Boolean,
  })
  @IsNotEmpty()
  correct: boolean;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  score: number;

  constructor(
    answerOptionDocument: AnswerOptionDocument,
    forAssessment: boolean,
  ) {
    this.id = answerOptionDocument._id.toString();
    this.text = answerOptionDocument.text;
    this.score = answerOptionDocument.score;
    this.correct = forAssessment ? null : answerOptionDocument.correct;
  }
}
