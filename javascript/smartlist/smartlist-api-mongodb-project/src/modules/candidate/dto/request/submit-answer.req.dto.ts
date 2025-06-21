import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min, ValidateIf } from 'class-validator';

export class SubmitAnswerReqDto {
  @ApiProperty({
    type: Array,
  })
  answer_ids: string[];

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  answer_text: string;

  @ApiProperty({
    type: String,
  })
  file_id: string;
}
