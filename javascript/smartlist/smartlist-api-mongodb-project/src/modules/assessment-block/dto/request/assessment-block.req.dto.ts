import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class AssessmentBlockReqDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @Length(1, 5000)
  instruction: string;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  duration: number;

  @ApiProperty({
    type: String,
  })
  closing_comments: string;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @IsInt()
  random_questions: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @IsInt()
  question_point: number;

  @ApiProperty({
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  shuffle_questions: boolean;
}
