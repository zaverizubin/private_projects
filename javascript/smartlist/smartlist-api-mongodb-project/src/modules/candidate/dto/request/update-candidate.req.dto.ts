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
    type: String,
  })
  @IsNotEmpty()
  photo_id: string;
}
