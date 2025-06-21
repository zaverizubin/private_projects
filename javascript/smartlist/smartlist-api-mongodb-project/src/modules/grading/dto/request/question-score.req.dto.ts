import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class QuestionScoreReqDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  assessment_id: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  question_id: string;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  score: number;
}
