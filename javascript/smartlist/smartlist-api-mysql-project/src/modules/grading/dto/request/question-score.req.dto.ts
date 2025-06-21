import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class QuestionScoreReqDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  assessment_id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  question_id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  score: number;
}
