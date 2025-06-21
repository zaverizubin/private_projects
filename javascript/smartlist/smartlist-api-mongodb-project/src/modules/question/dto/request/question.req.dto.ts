import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { AnswerOptionReqDto } from './answer-option.req.dto';
import { QuestionOptionReqDto } from './options.req.dto';

export class QuestionReqDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  score: number;

  @ApiProperty({ type: [AnswerOptionReqDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => AnswerOptionReqDto)
  answer_options: AnswerOptionReqDto[];
  
  @ApiProperty({
    type: JSON,
  })
  options: QuestionOptionReqDto;

  @ApiProperty({
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  shuffle_options: boolean;
}
