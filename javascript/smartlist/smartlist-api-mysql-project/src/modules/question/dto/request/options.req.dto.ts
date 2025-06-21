import { ApiProperty } from '@nestjs/swagger';

export class QuestionOptionReqDto {
  @ApiProperty({
    type: Boolean,
    default: true,
  })
  file_required: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
  })
  text_required: boolean;
}
