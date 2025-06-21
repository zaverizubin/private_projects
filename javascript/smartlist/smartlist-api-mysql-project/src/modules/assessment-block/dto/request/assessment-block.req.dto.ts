import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Length } from 'class-validator';

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
}
