import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AnswerOptionReqDto {
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
  score: number;
}
