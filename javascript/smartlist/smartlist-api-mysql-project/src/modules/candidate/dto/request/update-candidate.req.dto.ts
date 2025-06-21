import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, Min, ValidateIf } from 'class-validator';

export class UpdateCandidateProfileReqDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  @ValidateIf((a) => a.photo_id != null)
  @Min(1)
  photo_id: number;
}
