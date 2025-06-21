import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { AnswerOption } from 'src/entities/answer-option.entity';

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

  constructor(answerOption: AnswerOption, forAssessment: boolean) {
    this.id = answerOption.id;
    this.text = answerOption.text;
    this.score = answerOption.score;
    this.correct = forAssessment ? null : answerOption.correct;
  }
}
