import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min, ValidateIf } from 'class-validator';

export class SubmitAnswerReqDto {
  @ApiProperty({
    type: Array,
  })
  @ValidateIf((a) => a.answer_ids != null)
  @IsNumber({}, { each: true })
  answer_ids: number[];

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  answer_text: string;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  @ValidateIf((a) => a.file_id != null)
  @Min(1)
  file_id: number;
}
